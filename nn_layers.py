import numpy as np
import tensorflow as tf


def conv_layer(input, num_input_channels, filter_size, num_filters, name):
    with tf.variable_scope(name) as scope:
        shape = [filter_size, filter_size, num_input_channels, num_filters]

        weights = tf.Variable(tf.truncated_normal(shape, stddev = 0.05))
        biases = tf.Variable(tf.constant(0.05, shape=[num_filters]))

        layer = tf.nn.conv2d(input=input, filter=weights, strides=[1, 1, 1, 1], padding='SAME')
        layer += biases

        return layer

# Max-pool layer function
def pool_layer(input, name):
    with tf.variable_scope(name) as scope:
        layer = tf.nn.max_pool(value=input, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

        return layer

# Relu layer function
def relu_layer(input, name):
    with tf.variable_scope(name) as scope:
        layer = tf.nn.relu(input)

        return layer

# Fully-connected layer function
def fc_layer(input, num_inputs, num_outputs, name):
    with tf.variable_scope(name) as scope:
        weights = tf.Variable(tf.truncated_normal([num_inputs, num_outputs], stddev = 0.05))
        biases = tf.Variable(tf.constant(0.05, shape=[num_outputs]))

        layer = tf.matmul(input, weights) + biases

        return layer
