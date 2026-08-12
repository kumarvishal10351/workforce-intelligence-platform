"""
Recommendation Engine

Converts prediction and explanation information into
actionable retention suggestions for HR teams.

Recommendations are suggestions, not guarantees.
Initial implementation is rule-based.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from typing import Optional


class RecommendationEngine:
    """
    Generates retention recommendations based on risk level
    and contributing factors from SHAP explanations.

    Uses a rule-based approach to map risk signals to
    actionable HR suggestions.
    """

    # Rule definitions: (factor_keyword, risk_level) -> recommendation
    RULES = [
        {
            "factor": "PaymentTier",
            "risk_level": "High",
            "recommendation": (
                "Review compensation and career progression "
                "opportunities for this employee."
            ),
        },
        {
            "factor": "YearsAtCompany",
            "risk_level": "High",
            "recommendation": (
                "Consider tenure-based recognition, role rotation, "
                "or growth opportunities."
            ),
        },
        {
            "factor": "EverBenched",
            "risk_level": "High",
            "recommendation": (
                "Review project allocation and discuss "
                "opportunities for active, meaningful work."
            ),
        },
        {
            "factor": "Age",
            "risk_level": "High",
            "recommendation": (
                "Consider career development conversations "
                "aligned with the employee's career stage."
            ),
        },
        {
            "factor": "ExperienceInCurrentDomain",
            "risk_level": "High",
            "recommendation": (
                "Explore skill development opportunities or "
                "cross-domain project assignments."
            ),
        },
        {
            "factor": "City",
            "risk_level": "High",
            "recommendation": (
                "Review location-specific retention factors "
                "and work flexibility options."
            ),
        },
        {
            "factor": "Education",
            "risk_level": "High",
            "recommendation": (
                "Consider education-aligned career tracks "
                "and professional development programs."
            ),
        },
        {
            "factor": "Gender",
            "risk_level": "High",
            "recommendation": (
                "Evaluate workplace inclusivity programs "
                "and equal opportunity initiatives."
            ),
        },
    ]

    # Default recommendations by risk level
    DEFAULT_RECOMMENDATIONS = {
        "High": [
            "Schedule a one-on-one meeting with this employee.",
            "Review recent performance and satisfaction indicators.",
        ],
        "Medium": [
            "Monitor this employee's engagement over the coming weeks.",
            "Consider a check-in conversation.",
        ],
        "Low": [
            "No immediate action required. Continue regular engagement.",
        ],
    }

    def generate(
        self,
        risk_level: str,
        risk_probability: float,
        top_factors: Optional[list[dict]] = None,
    ) -> list[str]:
        """
        Generate recommendations based on risk level and factors.

        Parameters
        ----------
        risk_level : str
            Risk category: 'High', 'Medium', or 'Low'.
        risk_probability : float
            Model-predicted attrition probability.
        top_factors : list[dict], optional
            SHAP-derived factors increasing risk.
            Each dict has 'feature' and 'impact' keys.

        Returns
        -------
        list[str]
            List of recommended actions.
        """

        recommendations = []

        # Factor-based recommendations
        if top_factors:
            for factor_info in top_factors:
                feature = factor_info.get("feature", "")

                for rule in self.RULES:
                    # Match if the rule factor appears in the feature name
                    if (
                        rule["factor"].lower() in feature.lower()
                        and risk_level == rule["risk_level"]
                    ):
                        rec = rule["recommendation"]
                        if rec not in recommendations:
                            recommendations.append(rec)

        # Add default recommendations for the risk level
        defaults = self.DEFAULT_RECOMMENDATIONS.get(risk_level, [])
        for rec in defaults:
            if rec not in recommendations:
                recommendations.append(rec)

        return recommendations
