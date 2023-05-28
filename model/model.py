import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Embedding
from sklearn.model_selection import train_test_split
import pickle


# read dataset
df = pd.read_csv('dataset.csv', delimiter=";")

# split dataset into train and test sets
train_texts, test_texts, train_labels, test_labels = train_test_split(df['text'], df['category'], test_size=0.2, random_state=42)

# tokenize texts
tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=10000, oov_token="<OOV>")
tokenizer.fit_on_texts(train_texts)

# saving
with open('tokenizer_2.pickle', 'wb') as handle:
    pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

train_sequences = tokenizer.texts_to_sequences(train_texts)
test_sequences = tokenizer.texts_to_sequences(test_texts)

# pad sequences
max_len = 100 # set the maximum length of sequences
train_padded = pad_sequences(train_sequences, maxlen=max_len, padding='post', truncating='post')
test_padded = pad_sequences(test_sequences, maxlen=max_len, padding='post', truncating='post')

# define model architecture
model = Sequential()
model.add(Embedding(input_dim=10000, output_dim=32, input_length=max_len, mask_zero=True))
model.add(LSTM(64))
model.add(Dense(9, activation='softmax'))

# compile model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# train model
model.fit(train_padded, train_labels, validation_data=(test_padded, test_labels), epochs=2, batch_size=32)

# save model
model.save('model_2.h5')

# evaluate model on test set
loss, accuracy = model.evaluate(test_padded, test_labels, verbose=0)
print("Test loss:", loss)
print("Test accuracy:", accuracy)