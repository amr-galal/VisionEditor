import cv2
import numpy as np
import os
import pyautogui


eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
dataset_path = 'eyes_dataset_validation'
dataset_path_2 = 'eyes_in_face_dataset_validation'


# create a directory for the data set if it doesn't exist.
if not os.path.exists(dataset_path):
    os.mkdir(dataset_path)
# get the index of the next image to be saved
next_img_index = len(os.listdir(dataset_path))

# create a directory for the second data set
if not os.path.exists(dataset_path_2):
    os.mkdir(dataset_path_2)
# get the index of the next image to be saved
next_img_index_2 = len(os.listdir(dataset_path_2))


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
        print('number of eyes detected: ', len(eyes))


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

                # save images
                cv2.imwrite(dataset_path + '/' + str(next_img_index) + '.jpg', roi_gray[ey: ey + eh, ex: ex + ew])
                cv2.imwrite(dataset_path_2 + '/' + str(next_img_index_2) + '.jpg', roi_gray)
                next_img_index += 1
                next_img_index_2 += 1

                cursor_pos = pyautogui.position()

                all_data = []
                all_data.extend(right_eye_coord)
                all_data.extend(cursor_pos)


                with open(dataset_path +'_labels.txt', 'a') as f:
                    for d in all_data:
                        f.write(str(d))
                        if d is not all_data[-1]:
                            f.write(', ')
                    f.write('\n')

        # for (ex,ey,ew,eh) in eyes:
        #     cv2.rectangle(roi_gray,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
        #     cv2.imshow('left eye', roi_gray[ey: ey + eh, ex: ex + ew])

    cv2.imshow('gray_frame', gray_frame)




    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


cap.release()
cv2.destroyAllWindows()
