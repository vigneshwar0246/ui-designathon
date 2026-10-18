import { introContent } from "@/config/introContent";
import EnterDashboardButton from "./EnterDashboardButton";

type Scene = (typeof introContent.scenes)[number];

export default function IntroScene({ scene, position }: { scene: Scene; position: number }) {
  const isFinal = position === introContent.scenes.length - 1;

  return (
    <section
      className={`intro-scene intro-scene--${scene.id}`}
      data-intro-scene
      aria-label={scene.eyebrow}
      aria-hidden={position === 0 ? undefined : true}
    >
      <div className="intro-scene__inner">
        <div className="intro-scene__copy">
          <p className="intro-scene__eyebrow"><span className="accent-rule" />{scene.eyebrow}</p>
          {position === 0 ? (
            <h1 className="intro-scene__title">
              {scene.title.map((line) => <span key={line}>{line}</span>)}
            </h1>
          ) : (
            <h2 className="intro-scene__title">
              {scene.title.map((line) => <span key={line}>{line}</span>)}
            </h2>
          )}
          <p className="intro-scene__description">{scene.description}</p>
          {isFinal && (
            <div className="intro-scene__action">
              <EnterDashboardButton />
              <p>{introContent.finalAction.caption}</p>
            </div>
          )}
        </div>
        {scene.labels.length > 0 && (
          <div className="intro-scene__labels" aria-label="Monitoring focus">
            {scene.labels.map((label) => <span key={label}>{label}</span>)}
          </div>
        )}
      </div>
    </section>
  );
}
