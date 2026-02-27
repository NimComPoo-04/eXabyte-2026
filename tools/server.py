import ssl
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

httpd = ThreadingHTTPServer(("0.0.0.0", 8000), SimpleHTTPRequestHandler)
context = ssl.SSLContext(protocol=ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile="cert.pem")
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
print(f"Starting server @ https://0.0.0.0:8000")
httpd.serve_forever()

