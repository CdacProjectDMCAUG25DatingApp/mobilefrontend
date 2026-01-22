import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ===== CARD ===== */

  card: {
    width: '85%',
    height: '65%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
    marginBottom: 90, // space for bottom menu
  },

  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  /* ===== BOTTOM MENU ===== */

  bottomMenu: {
    position: 'absolute',
    bottom: 15,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
  },

  menuButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#000',
  },

  menuButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },

  menuText: {
    color: '#fff',
    fontSize: 12,
  },

  menuTextActive: {
    color: '#000',
    fontWeight: '600',
  },
});
