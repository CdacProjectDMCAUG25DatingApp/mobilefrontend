import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#000',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#198754', // green like your image
    paddingVertical: 12,
    borderRadius: 6,
    width: 100,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },

  signupRow: {
    flexDirection: 'row',
    marginTop: 16,
  },

  signupText: {
    color: '#000',
  },

  signupLink: {
    color: '#0d6efd',
    fontWeight: '500',
  },
});
