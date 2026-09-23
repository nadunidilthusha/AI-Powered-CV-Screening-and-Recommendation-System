const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Valid recommendation levels
const RECOMMENDATION_LEVELS = ['Highly Recommended', 'Recommended', 'Not Recommended'];

// Rule-based decision generator & justification fallback
const determineDecision = (evaluatorResult) => {
  const { matchPercentage, matchingSkills = [], missingSkills = [] } = evaluatorResult;

  let recommendation = 'Not Recommended';
  let justification = '';

  if (matchPercentage >= 80) {
    recommendation = 'Highly Recommended';
    justification = `Candidate demonstrates exceptional alignment with a match score of ${matchPercentage}%. Core proficiencies (${matchingSkills.join(', ')}) directly satisfy principal requirements with minimal skill gaps.`;
  } else if (matchPercentage >= 60) {
    recommendation = 'Recommended';
    justification = `Candidate shows competent alignment with a match score of ${matchPercentage}%. Meets key technical requirements (${matchingSkills.join(', ')}), but lacks certain qualifications (${missingSkills.join(', ')}) that may require onboarding training.`;
  } else {
    recommendation = 'Not Recommended';
    justification = `Candidate does not meet the minimum alignment threshold with a score of ${matchPercentage}%. Significant skill deficiencies identified (${missingSkills.join(', ')}).`;
  }

  return { recommendation, justification };
};

// @route   POST /api/ai/decision
// @access  Private (HR/Admin)
const makeDecision = asyncHandler(async (req, res) => {
  const { evaluatorResult } = req.body;

  if (!evaluatorResult || typeof evaluatorResult.matchPercentage !== 'number') {
    throw new ApiError(400, 'Please provide a valid evaluatorResult containing matchPercentage');
  }

  try {
    // 1. Forward evaluator results to Naduni's Python AI Microservice (decision_maker.py)
    const pythonServiceUrl = process.env.PYTHON_AI_DECISION_URL || 'http://localhost:8000/api/decision';

    const response = await fetch(pythonServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evaluatorResult })
    });

    if (!response.ok) {
      throw new Error(`Python decision service responded with status: ${response.status}`);
    }

    const decisionData = await response.json();

    // Validate recommendation category
    if (!RECOMMENDATION_LEVELS.includes(decisionData.recommendation)) {
      throw new Error('Invalid recommendation level returned by AI service');
    }

    res.success({
      decision: decisionData,
      status: 'Verified'
    }, 'Decision recommendation generated successfully');

  } catch (error) {
    console.error('AI Decision Maker Error:', error.message);

    // 2. Fallback logic: Execute deterministic evaluation rule set
    const fallbackDecision = determineDecision(evaluatorResult);

    res.success({
      decision: {
        recommendation: fallbackDecision.recommendation,
        justification: fallbackDecision.justification,
        analyzedMatchScore: evaluatorResult.matchPercentage,
        matchingSkillsCount: (evaluatorResult.matchingSkills || []).length,
        missingSkillsCount: (evaluatorResult.missingSkills || []).length
      },
      status: 'Mocked (Fallback Mode)'
    }, 'Decision recommendation generated successfully (Fallback Mode)');
  }
});

module.exports = { makeDecision };