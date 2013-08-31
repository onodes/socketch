import logging
import tornado.ioloop
import tornado.web
import tornado.websocket
import os.path
import json

class Application(tornado.web.Application):
	def __init__(self):
		handlers = [
			(r"/", MainHandler),
			(r"/sketch", SketchHandler),
			(r"/websocket", SocketHandler),
			]
		
		settings = dict(
			template_path=os.path.join(os.path.dirname(__file__), "templates"),
			static_path=os.path.join(os.path.dirname(__file__), "static")
			)
		tornado.web.Application.__init__(self, handlers, **settings)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")
        
        
class SketchHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("sketch.html")


cone = []
class SocketHandler(tornado.websocket.WebSocketHandler):

	def open(self):
		print "WebSocket opend"
		cone.append(self)

	def on_message(self, message):
		print message

		for i in cone:
			if i is not self:
				i.write_message(message)


	def on_close(self):
		print "WebSocket closed"
		if self in cone:
			cone.remove(self)

def main():
	app = Application()
	app.listen(8888)
	tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
	main()