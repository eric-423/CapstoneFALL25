import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";

interface TodayOffersSectionProps {
  title?: string;
  onPressSeeMore?: () => void;
  offers?: OfferCardProps[];
}

interface OfferCardProps {
  id: string;
  imageSource: any;
  discountText: string;
  descriptionText: string;
  onPress: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  imageSource,
  discountText,
  descriptionText,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{ width: 150, marginHorizontal: 5 }}
      onPress={onPress}
    >
      <View style={offerCardStyles.imageContainer}>
        <Image source={imageSource} style={offerCardStyles.image} />
      </View>
      <View style={offerCardStyles.container}>
        <Text style={offerCardStyles.discountText}>{discountText}</Text>
        <Text style={offerCardStyles.descriptionText}>{descriptionText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const TodayOffersSection: React.FC<TodayOffersSectionProps> = ({
  title = "Ưu Đãi Hôm Nay",
  onPressSeeMore,
  offers = [],
}) => {
  const handleSeeMore = () => {
    if (onPressSeeMore) {
      onPressSeeMore();
    } else {
      router.push("/(tabs)/blog");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleSeeMore}>
          <Text style={styles.seeMoreText}>Xem thêm &gt;</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.offersList}
      >
        {offers.map((offer) => (
          <OfferCard key={offer.id} {...offer} />
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: APP_COLOR.BROWN,
  },
  seeMoreText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
  offersList: {
    paddingRight: 15,
  },
});

const offerCardStyles = StyleSheet.create({
  container: {
    position: "relative",
    top: -25,
    zIndex: -100,
    backgroundColor: APP_COLOR.DARK_YELLOW,
    borderRadius: 10,
    width: 150,
    alignItems: "center",
    marginRight: 10,
    paddingTop: 25,
  },
  imageContainer: {
    width: 125,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
  },
  discountText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: APP_COLOR.ORANGE,
    marginBottom: 5,
  },
  descriptionText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: APP_COLOR.GRAY,
    textAlign: "center",
  },
});

export default TodayOffersSection;
