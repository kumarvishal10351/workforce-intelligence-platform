from ..base import BaseValidator
from ..result import ValidationResult
class BusinessRuleValidator(BaseValidator):

    def __init__(self, rules):

        self.rules = rules

    def validate(self, data):

        result = ValidationResult()

        for rule in self.rules:

            rule.validate(data, result)

        return result