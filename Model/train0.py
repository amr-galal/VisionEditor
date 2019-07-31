import numpy as np
import cv2
from dataloader0 import DataLoader
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

np.random.seed(0)

def main():

    dataset_path = 'eyes_dataset'
    loader = DataLoader(dataset_path, num_classes = 4)
    # dim = (24, 24)
    dim = (48, 48)
    loader.preprocessing_settings(new_dim = dim)

    X_train, y_train = loader.get_data()
    # One-hot encoding of the labels
    # labels_ohe = to_categorical(labels, num_classes = self.num_classes)
    # tf.cast(labels_ohe, tf.float32)
    print('X_train shape: {}, y_train shape: {}'.format(X_train.shape, y_train.shape))

    X_val_test, y_val_test = loader.get_validation()
    X_val, X_test, y_val , y_test = train_test_split(X_val_test, y_val_test, test_size = 0.3, shuffle = True)

    print('X_val.shape: {}, y_val.shape: {}'.format(X_val.shape, y_val.shape))
    print('X_test.shape: {}, y_test.shape: {}'.format(X_test.shape, y_test.shape))


    param_grid = {
        'kernel': ['linear', 'rbf'],
        'gamma' : [0.001, 0.01, 0.1, 1],
        'C': [0.8, 1, 10, 100 ],
    }
    svm_clf = GridSearchCV(SVC(), param_grid, cv = 5, scoring = 'f1_micro')
    svm_clf.fit(X_train.reshape(X_train.shape[0], -1), y_train)

    pred_svm = svm_clf.predict(X_val_test.reshape(X_val_test.shape[0], -1))
    print('classification report:')
    print(classification_report(y_val_test, pred_svm))
    print()
    print('model accuracy:')
    print( sum(pred_svm == y_val_test) / len(y_val_test) )










    # cv2.imshow('img', train_batch[0])
    # cv2.waitKey()
    # print('image label: ', train_label[0])


if __name__ == '__main__':
    main()
