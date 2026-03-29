import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, shadows } from '../styles/theme';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'medium', // small, medium, large
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]];
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.buttonSecondary];
      case 'outline':
        return [...baseStyle, styles.buttonOutline];
      case 'ghost':
        return [...baseStyle, styles.buttonGhost];
      default:
        return [...baseStyle, styles.buttonPrimary];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`]];
    
    switch (variant) {
      case 'outline':
        return [...baseStyle, styles.textOutline];
      case 'ghost':
        return [...baseStyle, styles.textGhost];
      default:
        return [...baseStyle, styles.textPrimary];
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.primary;
      default:
        return colors.textWhite;
    }
  };

  return (
    <TouchableOpacity
      style={[
        ...getButtonStyle(),
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textWhite} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={size === 'small' ? 16 : 20} color={getIconColor()} style={styles.iconLeft} />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={size === 'small' ? 16 : 20} color={getIconColor()} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  buttonSmall: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 80,
  },
  buttonMedium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minWidth: 120,
  },
  buttonLarge: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    minWidth: 160,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  textSmall: {
    fontSize: fontSize.sm,
  },
  textMedium: {
    fontSize: fontSize.md,
  },
  textLarge: {
    fontSize: fontSize.lg,
  },
  textPrimary: {
    color: colors.textWhite,
  },
  textOutline: {
    color: colors.primary,
  },
  textGhost: {
    color: colors.primary,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});

export default CustomButton;
