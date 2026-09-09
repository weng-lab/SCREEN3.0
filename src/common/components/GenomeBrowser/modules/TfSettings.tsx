import type { TrackSettingsProps } from "@weng-lab/genomebrowser";
import {
  TrackSettingsLayout,
  TrackSettingsSection,
  TrackSettingsFieldGrid,
  TrackSettingsUrlField,
} from "@weng-lab/genomebrowser-tracks/shared";
import type { Config, Peak } from "./tfPeaks";
import TfFilterFields from "./TfFilterFields";

export default function TfSettings({ track, updateTrack }: TrackSettingsProps<Config, Peak>) {
  return (
    <TrackSettingsLayout>
      <TrackSettingsSection title="Data sources">
        <TrackSettingsFieldGrid>
          <TrackSettingsUrlField
            label="Peaks URL"
            value={track.config.primaryUrl}
            disabled={track.source === "host"}
            onCommit={(primaryUrl) => updateTrack({ config: { primaryUrl } })}
          />
          <TrackSettingsUrlField
            label="Motifs URL"
            value={track.config.overlayUrl}
            disabled={track.source === "host"}
            onCommit={(overlayUrl) => updateTrack({ config: { overlayUrl } })}
          />
        </TrackSettingsFieldGrid>
      </TrackSettingsSection>
      <TrackSettingsSection title="TF filters">
        <TfFilterFields filter={track.config.filter} updateTrack={updateTrack} />
      </TrackSettingsSection>
    </TrackSettingsLayout>
  );
}
