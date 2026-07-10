class SalaryRule(BaseRule):

    def validate(self, data, result):

        invalid = data[
            data["MonthlyIncome"] <= 0
        ]

        if not invalid.empty:

            result.add_error(
                f"{len(invalid)} employees have invalid salary."
            )