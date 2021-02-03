from flask import Flask, request
import numpy as np
import pickle
import json

file = open('trainednetwork.p', 'rb')
nn = pickle.load(file)
file.close()
app = Flask(__name__)

@app.route('/process_image')
def process_image():
    image = request.args.get('image')
    if image is not "":
        image = image.replace('%22', '"')
        image = json.loads(image)
        print(image)
        image_array = preprocess(image)
        output = nn.feedforward(image_array)
        prediction = np.where(output == np.amax(output))
        prediction = prediction[0][0]
        return {'image_prediction': int(prediction)}
    else:
        return {'image_prediction': "Nope"}

def preprocess(image):
    lines = image['lines']
    image_array = np.zeros((28, 28))
    x_points = []
    y_points = []
    for stroke in lines:
        points = stroke["points"]
        for point in points:
            x_points.append(int(point["x"]))
            y_points.append(int(point["y"]))
    x_points = np.divide(x_points, 10)
    y_points = np.divide(y_points, 10)
    for i in range(len(x_points)):
        image_array[int(y_points[i])][int(x_points[i])] = 1
        image_array[int(y_points[i])+1][int(x_points[i])] = 1
    image_array = image_array.reshape((784, 1))
    return image_array