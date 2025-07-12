from flask import Blueprint

errors = Blueprint('errors', __name__)

from . import handlers # avoid circular import errors