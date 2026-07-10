class ValidationError(Exception):
    """Base validation exception."""
    pass


class MissingColumnError(ValidationError):
    pass


class InvalidDataTypeError(ValidationError):
    pass


class InvalidFileTypeError(ValidationError):
    pass