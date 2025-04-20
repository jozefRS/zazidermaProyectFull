import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#8C2475',
  secondary: '#B03183',
  lightGray: '#D9D9D9',
  darkGray: '#A8A3A3',
  white: '#FFFFFF',
  black: '#000000',
  green: '#4CAF50',
  red: '#F44336',
  blue: '#2196F3',
  orange: '#FF9800',
  gray: '#607D8B',
  violet: '#9C27B0',
};

export const FONTS = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
};

export const GLOBAL_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: '90%',
    height: '70%',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.primary,
    width: '100%',
    marginVertical: 10,
  },
  forgotText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#000',
  },
  recoverText: {
    textAlign: 'center',
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 6,
  },
  tooltipText: {
    backgroundColor: '#f0f0f0',
    color: COLORS.black,
    padding: 8,
    borderRadius: 8,
    elevation: 4,
    fontSize: 14,
    maxWidth: 250,
  },
  tooltipIcon: {
    marginLeft: 5,
  },
});
