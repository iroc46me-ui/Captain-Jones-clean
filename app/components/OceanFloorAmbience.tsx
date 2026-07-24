"use client";

import styles from "./OceanFloorAmbience.module.css";

type OceanFloorAmbienceProps = {
  showDiver?: boolean;
  showBubbles?: boolean;
  density?: "light" | "medium";
};

export default function OceanFloorAmbience({
  showDiver = false,
  showBubbles = true,
  density = "light",
}: OceanFloorAmbienceProps) {
  return (
    <div
      className={`${styles.environment} ${styles[density]}`}
      aria-hidden="true"
    >
      <div className={styles.waterGlow} />

      <div className={styles.leftFloor}>
        <img
          src="/harbor-watch-seaweed-left.png"
          alt=""
          className={styles.leftSeaweed}
        />

        <div className={styles.leftRock} />
        <div className={styles.leftRockSmall} />
      </div>

      <div className={styles.rightFloor}>
        <img
          src="/harbor-watch-seaweed-left.png"
          alt=""
          className={styles.rightSeaweed}
        />

        <div className={styles.rightRock} />
        <div className={styles.rightRockSmall} />
      </div>

      <div className={styles.centerFloor}>
        <div className={styles.sandRise} />
        <div className={styles.centerRock} />

        {showBubbles && (
          <div className={styles.clamArea}>
            <div className={styles.clam}>
              <div className={styles.clamBack} />
              <div className={styles.clamInterior} />
              <div className={styles.clamFront} />
            </div>

            <div className={styles.bubbleColumn}>
              <span className={styles.bubbleOne} />
              <span className={styles.bubbleTwo} />
              <span className={styles.bubbleThree} />
              <span className={styles.bubbleFour} />
            </div>
          </div>
        )}
      </div>

      {showDiver && (
        <img
          src="/harbor-watch-diver.png"
          alt=""
          className={styles.diver}
        />
      )}

      <div className={styles.floorFade} />
    </div>
  );
}