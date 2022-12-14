# Import Flask, the Python micro web framework
from flask import Flask, render_template, make_response, request
from flask_cors import CORS
from pdf_controller import upn4pdf, upn4zip

# app = Flask(__name__,  template_folder="templates")

# Create the application instance
app = Flask(__name__, template_folder="templates")
cors = CORS(app, resources=r'/api-upnqr/*', origins=["https://potep.in"],
            methods=['GET', 'HEAD', 'POST'], SameSite=None)


@app.route("/")
def home():
    """
    This function just responds to the browser URL
    localhost:5000/
    :return:        the rendered template "home.html"
    """
    return render_template("home.html")


@app.route("/pdfUpnQrPrint", methods=['POST'])
def upn_pdf():
    osebas = request.get_json()
    response = make_response(upn4pdf(osebas=osebas))
    response.headers.set('Content-Type', 'application/pdf')
    return response


@app.route("/pdfUpnQr4stream2zip", methods=['POST'])
def upn_zip():
    oseba = request.get_json()
    response = make_response(upn4zip(oseba=oseba))
    response.headers.set('Content-Type', 'application/pdf')
    return response


if __name__ == "__main__":
    app.run(debug=False)
