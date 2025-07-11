from api.models.ingredient import Ingredient

def test_ingredient_model_fields():
    ingredient = Ingredient(id=1, name="Salt")
    assert ingredient.id == 1
    assert ingredient.name == "Salt"
