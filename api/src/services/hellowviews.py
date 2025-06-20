from flask_restx import Resource, Namespace

hello_ns = Namespace("hello", description="Hello World API")

@hello_ns.route("/hw")
class HelloWorld(Resource):
    def get(self):
        return {"message": "Hello, World!"}
    
