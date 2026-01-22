import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 14
  },

  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16
  },

  helperText: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 6
  },

  button: {
    backgroundColor: '#198754',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 24,
    width: 120,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },

  loginRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center'
  },

  loginText: {
    fontSize: 14
  },

  loginLink: {
    fontSize: 14,
    color: '#0d6efd',
    fontWeight: '500'
  }
});
