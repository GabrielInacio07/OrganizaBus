import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import styles from "@/styles/components/HeroSlider.module.css";

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop
      className={styles.swiper}
    >
      <SwiperSlide>
        <div className={styles.slide} style={{ backgroundImage: "" }} />
      </SwiperSlide>
      <SwiperSlide>
        <div className={styles.slide} style={{ backgroundImage: "" }} />
      </SwiperSlide>
      <SwiperSlide>
        <div className={styles.slide} style={{ backgroundImage: "" }} />
      </SwiperSlide>
    </Swiper>
  );
}