import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function ScanIsbnScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera Permission Needed</Text>
        <Text style={styles.text}>
          Bloom & Binding needs camera access to scan ISBN barcodes.
        </Text>

        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
  if (scanned) return;

  const cleaned = data.replace(/[^0-9]/g, "");

  const isIsbnBarcode =
    cleaned.length === 13 &&
    (cleaned.startsWith("978") || cleaned.startsWith("979"));

  if (!isIsbnBarcode) {
    console.log("Ignored non-ISBN barcode:", cleaned);
    return;
  }

  setScanned(true);

  router.push({
    pathname: "/add-book",
    params: {
      isbn: cleaned,
    },
  });
};

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.scanBox} />

        <Text style={styles.helperText}>Line up the book barcode inside the frame</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE4D2",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  camera: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    paddingTop: 70,
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(238,228,210,0.85)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  backText: {
    color: "#234028",
    fontSize: 22,
    fontFamily: "CormorantGaramond_600SemiBold",
  },

  scanBox: {
    width: 280,
    height: 160,
    borderWidth: 2,
    borderColor: "#F7F0E4",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  helperText: {
    color: "#F7F0E4",
    fontSize: 24,
    fontFamily: "CormorantGaramond_600SemiBold",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    marginBottom: 40,
  },

  title: {
    color: "#234028",
    fontSize: 34,
    fontFamily: "CormorantGaramond_600SemiBold",
    textAlign: "center",
    marginBottom: 12,
  },

  text: {
    color: "#4A5A46",
    fontSize: 22,
    fontFamily: "CormorantGaramond_500Medium",
    textAlign: "center",
    marginBottom: 24,
  },

  button: {
    backgroundColor: "#234028",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
  },

  buttonText: {
    color: "#F7F0E4",
    fontSize: 24,
    fontFamily: "CormorantGaramond_600SemiBold",
  },
});