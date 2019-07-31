import numpy as np
import cv2
from dataloader0 import DataLoader
from model0 import CNN
import tensorflow as tf


eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')



new_graph = tf.Graph()
with tf.Session(graph = new_graph) as sess:

    saver = tf.train.import_meta_graph('./model/cnn-epoch-3-val_acc-0.22891566157341003.h5.meta')
    saver.restore(sess, tf.train.latest_checkpoint('./model/'))

    input_images = new_graph.get_tensor_by_name("X:0")
    drop_out_prob = new_graph.get_tensor_by_name("Placeholder:0")



    cap = cv2.VideoCapture(0)


    while( cap.isOpened() ):
        ret, frame = cap.read()
        if not ret:
            print('problem')

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray_frame = cv2.flip(gray_frame , 1)

        # get the face
        faces = face_cascade.detectMultiScale(gray_frame)
        for (x,y,w,h) in faces:
            roi_gray = gray_frame[y:y+h, x:x+w]
            eyes = eye_cascade.detectMultiScale(roi_gray, minNeighbors = 6, maxSize = (70, 70), minSize = (30, 30))
            eyes = eyes[::-1][:2]
            # print('number of eyes detected: ', len(eyes))

            if cv2.waitKey(1) & 0xFF == ord('s'):
                if len(eyes) == 2:
                    eyes_coords = np.concatenate((eyes[0], eyes[1]))
                    # if right eye
                    if eyes_coords[0] - eyes_coords[4] > 0:
                        right_eye_ind = 4
                    else:
                        right_eye_ind = 0

                    ex = eyes_coords[right_eye_ind]
                    ey = eyes_coords[right_eye_ind + 1]
                    ew = eyes_coords[right_eye_ind + 2]
                    eh = eyes_coords[right_eye_ind + 3]
                    right_eye_coord = [ex, ey, ew, eh]

                    # verbose
                    # cv2.imshow('right eye', roi_gray[ey: ey + eh, ex: ex + ew])
                    # cv2.imshow('right eye', roi_gray[ey: ey + eh, ex: ex + ew])
                    # cv2.waitKey()

                    X_test = roi_gray[ey: ey + eh, ex: ex + ew]
                    X_test = cv2.resize(X_test, (48, 48))
                    X_test2 = roi_gray
                    X_test2 = cv2.resize(X_test2, (48, 48))

                    feed_dict = {input_images: np.stack([X_test, X_test2], axis = 0), drop_out_prob: 1.}

                    # #Now, access the op that you want to run.
                    softmax = new_graph.get_tensor_by_name('Softmax/Softmax:0')
                    pred_cnn = tf.argmax(softmax, axis = 1)
                    prediction = sess.run(pred_cnn, feed_dict)

                    print('prediction:')
                    print(prediction)
                    print()


        cv2.imshow('gray_frame', gray_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break





cap.release()
cv2.destroyAllWindows()
