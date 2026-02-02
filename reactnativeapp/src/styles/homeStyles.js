            import { StyleSheet } from 'react-native';

            export default StyleSheet.create({
            container: {
                
                paddingTop:50,
                paddingBottom:67,
                flex: 1,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
            },
            

            /*  SWIPE CARD  */

            card: {
                width: '85%',
                height: '65%',
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: '#111',
                marginBottom: 100,
            },

            image: {
                width: '100%',
                height: '100%',
            },

            /*  BOTTOM MENU  */

            bottomMenu: {
                position: 'absolute',
                bottom: 15,
                left: 10,
                right: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
            },

            menuButton: {
                paddingVertical: 10,
                paddingHorizontal: 10,
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

            /*  SETTINGS PANEL  */

            settingsContainer: {
                width: '85%',
                marginBottom: 100,
            },

            settingsHeader: {
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 25,
                paddingVertical: 10,
                paddingHorizontal: 30,
                marginBottom: 30,
            },

            settingsTitle: {
                color: '#fff',
                fontSize: 22,
                fontWeight: '600',
            },

            settingsButton: {
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 18,
                paddingVertical: 18,
                marginBottom: 20,
                alignItems: 'center',
            },

            settingsText: {
                color: '#fff',
                fontSize: 16,
            },

            logoutButton: {
                borderRadius: 18,
                paddingVertical: 18,
                alignItems: 'center',
                backgroundColor: '#1a0000',
                borderWidth: 1,
                borderColor: '#ff3b3b',
            },

            logoutText: {
                color: '#ff3b3b',
                fontSize: 16,
                fontWeight: '600',
            },
            /*  EDIT PROFILE  */

        editWrapper: {
        width: '100%',
        paddingHorizontal: 20,
        },

        previewCard: {
        alignSelf: 'center',
        width: '90%',
        height: 300,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#2a9df4',
        },

        previewImage: {
        width: '100%',
        height: '100%',
        },

        section: {
        backgroundColor: '#1c1f24',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        },

        sectionTitle: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 15,
        fontWeight: '600',
        },

        input: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 14,
        padding: 14,
        color: '#fff',
        marginBottom: 14,
        },

        dropdown: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        backgroundColor: '#fff',
        },

        dropdownText: {
        color: '#000',
        fontSize: 15,
        },

        saveBtn: {
        backgroundColor: '#FFD700',
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 10,
        },

        saveText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        },
        /* ===== MODAL ===== */

    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    },

    modalBox: {
    width: '85%',
    backgroundColor: '#000',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 20,
    },

    modalTitle: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '600',
    },

    modalInput: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    marginBottom: 14,
    },

    modalTextarea: {
    height: 100,
    textAlignVertical: 'top',
    },

    modalPrimaryBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    },

    modalPrimaryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    },

    modalSecondaryBtn: {
    backgroundColor: '#444',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    },

    modalSecondaryText: {
    color: '#fff',
    fontSize: 16,
    },
/* ===== AUTH (LOGIN / SIGNUP) ===== */

authContainer: {
  width: '100%',
},

authLabel: {
  color: '#fff',
  fontSize: 15,
  marginBottom: 6,
  marginTop: 10,
},

authInput: {
  borderWidth: 1,
  borderColor: '#444',
  borderRadius: 8,
  paddingVertical: 12,
  paddingHorizontal: 12,
  color: '#fff',
  fontSize: 15,
  marginBottom: 14,
  backgroundColor: '#000',
},

authHelperText: {
  color: '#aaa',
  fontSize: 13,
  marginBottom: 14,
  lineHeight: 18,
},

authButton: {
  backgroundColor: '#198754',
  paddingVertical: 14,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 20,
},

authButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

authLinkRow: {
  flexDirection: 'row',
  justifyContent: 'center',
},

authLinkText: {
  color: '#fff',
  fontSize: 14,
},

authLink: {
  color: '#4da3ff',
  fontSize: 14,
  textDecorationLine: 'underline',
},
/* ===== LOGIN ===== */

  container: {
    flex: 1,
    backgroundColor: "#222222", // light grey-blue from the web design
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loginContainer: {
    width: "90%",
    backgroundColor: "#0b0b0b", // dark section from web
    padding: 30,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
  },

  loginLabel: {
    color: "#e5e7eb", // light grey text
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },

  loginInput: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9ca3af", // similar to input border on web
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    color: "white",
    marginBottom: 20,
    fontSize: 15,
  },

  loginButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "600",
  },

  loginLinkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  loginLinkText: {
    color: "#d1d5db",
    fontSize: 14,
  },

  loginLink: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },


            });
