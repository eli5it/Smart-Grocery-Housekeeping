from flask import jsonify
from . import errors

@errors.app_errorhandler(404)
def handle_404(err):
    return jsonify(error=str(err)), 404

@errors.app_errorhandler(400)
def handle_400(err):
    return jsonify(error=str(err)), 400