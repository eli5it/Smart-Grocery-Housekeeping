from flask import Blueprint, jsonify, abort, request
from openfoodfacts import API, Environment
import json
from pathlib import Path

# Get absolute path to app/ingredient_mapping.json
json_file_path = Path(__file__).resolve().parent.parent.parent / "ingredient_mapping.json"

api = API(
    user_agent="SmartGroceryHousekeeping/1.0",
    # use .net environment for stagintg
        environment=Environment.net)


barcode_bp = Blueprint('barcode', __name__, url_prefix="/api/barcode-lookup")

@barcode_bp.route('/') 
def get_product_info_by_barcode():
    """Uses openfoodfacts api to get product info"""
    barcode = request.args.get('barcode')
    if not barcode:
         abort(400)


    res = api.product.get(barcode)
    if res: 
        # successfully got product info from openfoodfactsapi
        product_info = {
            "image_url": res['image_url'],
            "product_name": res['product_name'].lower(),
            "image_url": res['image_url']
        }
        # fetch associated ingredient for this product
        try:
            with open(json_file_path, 'r') as file:
                data = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError) as e:
                print(f"Loading ingredient mapping from: {json_file_path}")
                print('error opening json')
                abort(500, description="The server could not handle your request at this time. Please try again later")

        product_name = product_info.get('product_name', None)
        # presuming for now that product_name is always there
        # will likely need to add validation for the returned dict from the api
        for key in data.keys():
            if key.lower() in product_name:
                product_info['ingredient_name'] = data[key]
                break
        
        return product_info
    else:
        # failed to get product info from openfoodfactsapi
        abort(404)
    
    return jsonify(product_info)


