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
        <Text
          style={offerCardStyles.discountText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {discountText}
        </Text>
        <Text
          style={offerCardStyles.descriptionText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {descriptionText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const TodayOffersSection: React.FC<TodayOffersSectionProps> = ({
  title = "Ưu Đãi Hôm Nay",
  offers = [],
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {offers.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersList}
        >
          {offers.map((offer) => (
            <OfferCard key={offer.id} {...offer} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Hiện chưa có ưu đãi dành cho bạn</Text>
        </View>
      )}
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
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.medium,
    fontSize: 17,
  },
  offersList: {
    paddingRight: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: APP_COLOR.BROWN,
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
  },
  descriptionText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: APP_COLOR.BROWN,
    textAlign: "center",
  },
});

export default TodayOffersSection;
