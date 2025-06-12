from flask_restx import Resource, Namespace

ns = Namespace("hello", description="Hello World API")
@ns.route("/hw")
class HelloWorld(Resource):
    def get(self):
        return {"message": "Hello, World!"}
    
