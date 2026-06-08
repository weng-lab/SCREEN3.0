package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path"
	"strings"
)

type RNASeqTrack struct {
	ID                        string `json:"id"`
	Title                     string `json:"title"`
	URL                       string `json:"url"`
	RNASeqExperimentAccession string `json:"rnaseq_experiment_accession"`
	RNASeqFileAccession       string `json:"rnaseq_file_accession"`
}

type OldBiosample struct {
	Name                       string        `json:"name"`
	Ontology                   string        `json:"ontology"`
	LifeStage                  string        `json:"lifeStage"`
	SampleType                 string        `json:"sampleType"`
	DisplayName                string        `json:"displayname"`
	DNaseExperimentAccession   *string       `json:"dnase_experiment_accession"`
	H3K4Me3ExperimentAccession *string       `json:"h3k4me3_experiment_accession"`
	H3K27AcExperimentAccession *string       `json:"h3k27ac_experiment_accession"`
	CTCFExperimentAccession    *string       `json:"ctcf_experiment_accession"`
	ATACExperimentAccession    *string       `json:"atac_experiment_accession"`
	DNaseFileAccession         *string       `json:"dnase_file_accession"`
	H3K4Me3FileAccession       *string       `json:"h3k4me3_file_accession"`
	H3K27AcFileAccession       *string       `json:"h3k27ac_file_accession"`
	CTCFFileAccession          *string       `json:"ctcf_file_accession"`
	ATACFileAccession          *string       `json:"atac_file_accession"`
	DNaseSignalURL             string        `json:"dnase_signal_url,omitempty"`
	H3K4Me3SignalURL           string        `json:"h3k4me3_signal_url,omitempty"`
	H3K27AcSignalURL           string        `json:"h3k27ac_signal_url,omitempty"`
	CTCFSignalURL              string        `json:"ctcf_signal_url,omitempty"`
	ATACSignalURL              string        `json:"atac_signal_url,omitempty"`
	ChromHMM                   string        `json:"chromhmm,omitempty"`
	ChromHMMURL                string        `json:"chromhmm_url,omitempty"`
	RNASeqTracks               []RNASeqTrack `json:"rna_seq_tracks"`
	BigBedURL                  string        `json:"bigbedurl,omitempty"`
}

type Assay struct {
	ID                  string `json:"id"`
	Assay               string `json:"assay"`
	URL                 string `json:"url"`
	ExperimentAccession string `json:"experimentAccession"`
	FileAccession       string `json:"fileAccession"`
}

type NewBiosample struct {
	Name        string  `json:"name"`
	Ontology    string  `json:"ontology"`
	LifeStage   string  `json:"lifeStage"`
	SampleType  string  `json:"sampleType"`
	DisplayName string  `json:"displayName"`
	Assays      []Assay `json:"assays"`
}

func main() {
	if len(os.Args) < 3 {
		fmt.Println("Usage: go run format.go <input.json> <output.json>")
		os.Exit(1)
	}

	inputFile := os.Args[1]
	outputFile := os.Args[2]

	data, err := os.ReadFile(inputFile)
	if err != nil {
		fmt.Printf("Error reading input file: %v\n", err)
		os.Exit(1)
	}

	var inputWrapper struct {
		Data struct {
			CCREBiosampleQuery struct {
				Biosamples []OldBiosample `json:"biosamples"`
			} `json:"ccREBiosampleQuery"`
		} `json:"data"`
	}
	if err := json.Unmarshal(data, &inputWrapper); err != nil {
		fmt.Printf("Error parsing JSON: %v\n", err)
		os.Exit(1)
	}
	oldSamples := inputWrapper.Data.CCREBiosampleQuery.Biosamples

	var newSamples []NewBiosample
	for _, old := range oldSamples {
		newSample := NewBiosample{
			Name:        old.Name,
			Ontology:    old.Ontology,
			LifeStage:   old.LifeStage,
			SampleType:  old.SampleType,
			DisplayName: old.DisplayName,
			Assays:      []Assay{},
		}

		// Add DNase assay if present
		if old.DNaseFileAccession != nil {
			url := old.DNaseSignalURL
			if url == "" {
				url = "https://downloads.wenglab.org/Registry-V4/" + *old.DNaseFileAccession + ".bigWig"
			}
			newSample.Assays = append(newSample.Assays, Assay{
				ID:                  "dnase-" + *old.DNaseFileAccession,
				Assay:               "dnase",
				URL:                 url,
				ExperimentAccession: ptrToString(old.DNaseExperimentAccession),
				FileAccession:       *old.DNaseFileAccession,
			})
		}

		// Add H3K4me3 assay if present
		if old.H3K4Me3FileAccession != nil {
			url := old.H3K4Me3SignalURL
			if url == "" {
				url = "https://downloads.wenglab.org/Registry-V4/" + *old.H3K4Me3FileAccession + ".bigWig"
			}
			newSample.Assays = append(newSample.Assays, Assay{
				ID:                  "h3k4me3-" + *old.H3K4Me3FileAccession,
				Assay:               "h3k4me3",
				URL:                 url,
				ExperimentAccession: ptrToString(old.H3K4Me3ExperimentAccession),
				FileAccession:       *old.H3K4Me3FileAccession,
			})
		}

		// Add H3K27ac assay if present
		if old.H3K27AcFileAccession != nil {
			url := old.H3K27AcSignalURL
			if url == "" {
				url = "https://downloads.wenglab.org/Registry-V4/" + *old.H3K27AcFileAccession + ".bigWig"
			}
			newSample.Assays = append(newSample.Assays, Assay{
				ID:                  "h3k27ac-" + *old.H3K27AcFileAccession,
				Assay:               "h3k27ac",
				URL:                 url,
				ExperimentAccession: ptrToString(old.H3K27AcExperimentAccession),
				FileAccession:       *old.H3K27AcFileAccession,
			})
		}

		// Add CTCF assay if present
		if old.CTCFFileAccession != nil {
			url := old.CTCFSignalURL
			if url == "" {
				url = "https://downloads.wenglab.org/Registry-V4/" + *old.CTCFFileAccession + ".bigWig"
			}
			newSample.Assays = append(newSample.Assays, Assay{
				ID:                  "ctcf-" + *old.CTCFFileAccession,
				Assay:               "ctcf",
				URL:                 url,
				ExperimentAccession: ptrToString(old.CTCFExperimentAccession),
				FileAccession:       *old.CTCFFileAccession,
			})
		}

		// Add ATAC assay if present
		if old.ATACFileAccession != nil {
			url := old.ATACSignalURL
			if url == "" {
				url = "https://downloads.wenglab.org/Registry-V4/" + *old.ATACFileAccession + ".bigWig"
			}
			newSample.Assays = append(newSample.Assays, Assay{
				ID:                  "atac-" + *old.ATACFileAccession,
				Assay:               "atac",
				URL:                 url,
				ExperimentAccession: ptrToString(old.ATACExperimentAccession),
				FileAccession:       *old.ATACFileAccession,
			})
		}

		// Add ChromHMM assay if present
		if old.ChromHMMURL != "" {
			chromhmmAccession := extractAccessionFromURL(old.ChromHMMURL)
			newSample.Assays = append(newSample.Assays, Assay{
				ID:            "chromhmm-" + chromhmmAccession,
				Assay:         "chromhmm",
				URL:           old.ChromHMMURL,
				FileAccession: chromhmmAccession,
			})
		}

		// Add RNA-seq tracks
		for _, rna := range old.RNASeqTracks {
			url := rna.URL
			if url == "" {
				url = "https://downloads.wenglab.org/Registry-V4/" + rna.RNASeqFileAccession + ".bigWig"
			}
			newSample.Assays = append(newSample.Assays, Assay{
				ID:                  "rnaseq-" + rna.RNASeqFileAccession,
				Assay:               "rnaseq",
				URL:                 url,
				ExperimentAccession: rna.RNASeqExperimentAccession,
				FileAccession:       rna.RNASeqFileAccession,
			})
		}

		// Add cCRE bigBed as an assay
		if old.BigBedURL != "" {
			ccreAccession := extractAccessionFromURL(old.BigBedURL)
			newSample.Assays = append(newSample.Assays, Assay{
				ID:            "ccre-" + ccreAccession,
				Assay:         "ccre",
				URL:           old.BigBedURL,
				FileAccession: ccreAccession,
			})
		}

		newSamples = append(newSamples, newSample)
	}

	// Wrap in object with "tracks" key to match expected format
	wrapper := struct {
		Tracks []NewBiosample `json:"tracks"`
	}{
		Tracks: newSamples,
	}

	output, err := json.MarshalIndent(wrapper, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		os.Exit(1)
	}

	if err := os.WriteFile(outputFile, output, 0644); err != nil {
		fmt.Printf("Error writing output file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Successfully converted %d biosamples to %s\n", len(newSamples), outputFile)
}

func ptrToString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

// extractAccessionFromURL extracts the file accession from a URL
// e.g., "https://downloads.wenglab.org/Registry-V4/ENCFF170YYM.bigBed" -> "ENCFF170YYM"
// e.g., "https://downloads.wenglab.org/Registry-V4/ENCFF606INL_ENCFF501ILD.bigBed" -> "ENCFF606INL_ENCFF501ILD"
func extractAccessionFromURL(url string) string {
	// Get the filename from the URL
	filename := path.Base(url)
	// Remove the extension
	ext := path.Ext(filename)
	return strings.TrimSuffix(filename, ext)
}
