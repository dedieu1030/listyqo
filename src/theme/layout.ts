import type { TextStyle, ViewStyle } from 'react-native';
import { Colors } from './colors';

/** Même marge horizontale que le contenu scrollable. */
export const SCREEN_EDGE = 24;

/** Onglets racines (List, Plan, Explore) : alignement vertical des titres Lora. */
export const TAB_HEADER_TOP = 20;
export const TAB_HEADER_BOTTOM = 20;

export const tabRootTitleText: TextStyle = {
  fontFamily: 'Lora_700Bold',
  fontSize: 40,
  lineHeight: 44,
  color: Colors.textHeading,
};

/** Ligne titre + zone droite (icône ou spacer pour aligner avec les autres onglets). */
export const tabRootHeaderRow: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: SCREEN_EDGE,
  paddingTop: TAB_HEADER_TOP,
  paddingBottom: TAB_HEADER_BOTTOM,
};

/** Bloc sous le titre racine (ex. onglets Today / Saved sur List). */
export const tabRootBelowTitle: ViewStyle = {
  paddingHorizontal: SCREEN_EDGE,
};

/** En-têtes stack (détails liste, ajout, édition, réglages) : même hauteur et titre. */
export const STACK_HEADER_MIN_HEIGHT = 52;
export const stackHeaderTitleText: TextStyle = {
  fontFamily: 'Inter_700Bold',
  fontSize: 18,
  color: Colors.textHeading,
};

export const stackHeaderBar: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: SCREEN_EDGE,
  paddingVertical: 12,
  minHeight: STACK_HEADER_MIN_HEIGHT,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
  backgroundColor: Colors.background,
};
