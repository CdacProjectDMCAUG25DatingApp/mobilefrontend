import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";

const BottomTabsPager = ({ tabs, screens }) => {
  const pagerRef = useRef(null);
  const [page, setPage] = useState(0);

  const goToPage = (i) => {
    setPage(i);
    pagerRef.current?.setPage(i);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ===== MAIN PAGER ===== */}
      <PagerView
        scrollEnabled={false}
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {screens.map((ScreenComponent, i) => (
          <View key={i} style={{ flex: 1 }}>
            {ScreenComponent}
          </View>
        ))}
      </PagerView>

      {/* ===== BOTTOM TAB BAR ===== */}
      <View style={styles.tabRow}>
        {tabs.map((label, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => goToPage(i)}
            style={[styles.tabItem, page === i && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, page === i && styles.tabTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomTabsPager;

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#111",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabItemActive: {
    borderTopWidth: 3,
    borderTopColor: "#e94560",
  },
  tabText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "white",
  },
});
