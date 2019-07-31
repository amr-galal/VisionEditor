import numpy as np
import tensorflow as tf
from nn_layers import *
import os
import cv2
from keras.utils import to_categorical

class CNN:
    def __init__(self, img_side_dim, num_classes):

        # Model Inputs
        tf.reset_default_graph()

        # Placeholder variables for the input
        x = tf.placeholder(tf.float32, shape=[None, img_side_dim, img_side_dim], name = 'X')
        self.x = x
        x_image = tf.reshape(x, [-1, img_side_dim, img_side_dim, 1])

        y_true = tf.placeholder(tf.float32, shape=[None, num_classes], name = 'y_true')
        self.y_true = y_true
        # for Accuracy calculation
        y_true_cls = tf.argmax(y_true, axis = 1)
        self.y_true_cls = y_true_cls

        # keep probability of node, for Drop out layers
        keep_prob = tf.placeholder(tf.float32)
        self.keep_prob = keep_prob


        with tf.variable_scope('Conv_Block_1'):
            layer_conv1_1 = conv_layer(input = x_image, num_input_channels = 1, filter_size = 7, num_filters = 8, \
                                       name = "conv1")
            layer_conv1_2 = conv_layer(input = layer_conv1_1, num_input_channels = 8, filter_size = 7, num_filters = 8, \
                                       name = "conv2")
            # Max pool
            layer_pool1 = pool_layer(layer_conv1_2, name = "pool1" )
            # RelU
            layer_relu1 = relu_layer(layer_pool1, name = "relu1")

        # Drop-out
        # drop_out_1 = tf.nn.dropout(layer_relu1, keep_prob, name = 'drop_out_1')

        # Convolutional Block 2
        with tf.variable_scope('Conv_Block_2'):
            layer_conv2_1 = conv_layer(input = layer_relu1, num_input_channels = 8, filter_size = 5, num_filters = 16, \
                                       name = "conv1")
            layer_conv2_2 = conv_layer(input = layer_conv2_1, num_input_channels = 16, filter_size = 5, num_filters = 16, \
                                       name = "conv2")
            layer_conv2_3 = conv_layer(input = layer_conv2_2, num_input_channels = 16, filter_size = 5, num_filters = 16, \
                                       name = "conv3")

            # Max pool
            layer_pool2 = pool_layer(layer_conv2_3, name = "pool2" )
            # RelU
            layer_relu2 = relu_layer(layer_pool2, name = "relu2")


        # Drop-out
        # drop_out_2 = tf.nn.dropout(layer_relu2, keep_prob, name = 'drop_out_2')


        # Convolutional Block 3
        # with tf.variable_scope('Conv_Block_3'):
        #     layer_conv3_1 = conv_layer(input = layer_relu2, num_input_channels = 16, filter_size = 3, num_filters = 32, \
        #                                name = "conv1")
        #     layer_conv3_2 = conv_layer(input = layer_conv3_1, num_input_channels = 32, filter_size = 3, num_filters = 32, \
        #                                name = "conv2")
        #     # Max pool
        #     layer_pool3 = pool_layer(layer_conv3_2, name = "pool3" )
        #     # RelU
        #     layer_relu3 = relu_layer(layer_pool3, name = "relu3")


        # Flatten
        num_features = layer_relu2.get_shape()[1:4].num_elements()
        layer_flat = tf.reshape(layer_relu2, [-1, num_features])

        # Fully-Connected
        layer_fc1_0 = fc_layer(layer_flat, num_inputs = num_features, num_outputs = 512, name = "fc1_0")
        layer_fc1_0_2 = fc_layer(layer_fc1_0, num_inputs = 512, num_outputs = 512, name = "fc1_0_2")
        layer_fc1 = fc_layer(layer_fc1_0_2, num_inputs = 512, num_outputs = 256, name = "fc1")
        layer_fc1_2 = fc_layer(layer_fc1, num_inputs = 256, num_outputs = 128, name = "fc1_2")
        layer_relu1_2 = relu_layer(layer_fc1_2, name = "relu1_2")
        layer_fc1_3 = fc_layer(layer_relu1_2, num_inputs = 128, num_outputs = 64, name = "fc1_3")
        layer_fc1_4 = fc_layer(layer_fc1_3, num_inputs = 64, num_outputs = 32, name = "fc1_3")

        # RelU
        layer_relu4 = relu_layer(layer_fc1_3, name = "relu4")

        # Drop-out
        # drop_out_3 = tf.nn.dropout(layer_relu4, keep_prob, name = 'drop_out_3')

        # Fully-Connected
        layer_fc2 = fc_layer(input = layer_relu4, num_inputs = 64, num_outputs = num_classes, name = "fc2")
        self.logits = layer_fc2

        # Softmax Layer
        with tf.variable_scope("Softmax"):
            y_pred = tf.nn.softmax(layer_fc2)
            self.y_pred = y_pred
            y_pred_cls = tf.argmax(y_pred, axis = 1)
            self.predictions = y_pred_cls



    def output(self):
        return self.predictions


    def train(self, loader, num_epochs = 50):


        # Training Summary

        writer = tf.summary.FileWriter("summary/training/")
        writer1 = tf.summary.FileWriter("summary/validation/")

        # Training Settings

        # Cross-entropy cost function
        with tf.name_scope("cross_ent"):
            cross_entropy = tf.nn.softmax_cross_entropy_with_logits_v2(logits = self.logits, labels = self.y_true)
            cost = tf.reduce_mean(cross_entropy)

        # Adam optimizer
        with tf.name_scope("optimizer"):
            optimizer = tf.train.AdamOptimizer(learning_rate = 1e-4).minimize(cost)

        # Accuracy
        with tf.name_scope("accuracy"):
            correct_prediction = tf.equal(self.predictions, self.y_true_cls)
            accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

        # Training

        saver = tf.train.Saver()

        graph = tf.get_default_graph()

        if not os.path.exists('model'):
            os.mkdir('model')


        best_val_acc = -1
        no_improvement_epochs = 0
        early_stopping_patience = 10

        # Add the cost and accuracy to summary
        tf.summary.scalar('loss', cost)
        tf.summary.scalar('accuracy', accuracy)

        # Merge all summaries together
        merged_summary = tf.summary.merge_all()

        # data
        X_train, y_train = loader.get_data()
        X_val, y_val = loader.get_validation()

        # One-hot encoding of the labels
        y_train_ohe = to_categorical(y_train)
        tf.cast(y_train_ohe, tf.float32)






        with tf.Session() as sess:
            # Initialize all variables
            sess.run( tf.global_variables_initializer() )

            # Add the model graph to TensorBoard
            writer.add_graph(sess.graph)

            # Loop over number of epochs
            for epoch in range(num_epochs):

                train_accuracy = 0

                for b in range(loader.num_batches):
                    start = b * loader.batch_size
                    end = min( start + loader.batch_size, X_train.shape[0] )
                    # Get one batch
                    x_batch, y_true_batch = X_train[start:end, :, :], y_train_ohe[start:end, :]

                    feed_dict_train = {self.x: x_batch, self.y_true: y_true_batch, self.keep_prob: 0.5}

                    # Run the session to minimise the cost function
                    sess.run(optimizer, feed_dict = feed_dict_train)

                    # Calculate the training accuracy
                    train_accuracy += sess.run(accuracy, feed_dict = feed_dict_train)

                    # Generate the summary for the current batch
                    summ = sess.run(merged_summary, feed_dict = feed_dict_train)
                    writer.add_summary(summ, epoch * loader.num_batches + b)


                train_accuracy /= loader.num_batches

                X_val, y_val = loader.get_validation()
                y_val_ohe = to_categorical(y_val)
                tf.cast(y_val_ohe, tf.float32)

                # Generate summary and validate the model on the entire validation set
                summ, val_accuracy = sess.run([merged_summary, accuracy], feed_dict={self.x: X_val, self.y_true: y_val_ohe,\
                                                                                     self.keep_prob: 1.})
                writer1.add_summary(summ, epoch)

                print("Epoch " + str(epoch + 1) + " completed.")
                print("\tAccuracy:")
                print ("\t- Training Accuracy:\t{}".format(train_accuracy))
                print ("\t- Validation Accuracy:\t{}".format(val_accuracy))

                if val_accuracy > best_val_acc:
                    best_val_acc = val_accuracy
                    no_improvement_epochs = 0
                    saver.save(sess, './model/cnn-epoch-{}-val_acc-{}.h5'.format(epoch, val_accuracy))
                else:
                    no_improvement_epochs += 1

                if no_improvement_epochs == early_stopping_patience:
                    print('Training stopped after reaching early stopping condition.')
                    break
