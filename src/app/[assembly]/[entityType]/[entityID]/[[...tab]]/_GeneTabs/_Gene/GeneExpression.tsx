import TwoPaneLayout from "../../../../../../../common/components/TwoPaneLayout";
import { useMemo, useRef, useState } from "react";
import GeneExpressionTable from "./GeneExpressionTable";
import GeneExpressionUMAP from "./GeneExpressionUMAP";
import GeneExpressionBarPlot from "./GeneExpressionBarPlot";
import { useGeneExpression, UseGeneExpressionReturn } from "common/hooks/useGeneExpression";
import { BarChart, CandlestickChart, ScatterPlot } from "@mui/icons-material";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import GeneExpressionViolinPlot from "./GeneExpressionViolinPlot";
import { Assembly } from "types/globalTypes";
import { DownloadPlotHandle } from "@weng-lab/visualization";
import VersionFallback from "./GeneVersionFallback";

export type PointMetadata = UseGeneExpressionReturn["data"][number];

export type GeneExpressionProps = {
  geneData: UseGeneDataReturn<{ name: string, assembly: Assembly }>;
  assembly: Assembly;
};

export type SharedGeneExpressionPlotProps = GeneExpressionProps & {
  rows: PointMetadata[];
  selected: PointMetadata[];
  setSelected: (selected: PointMetadata[]) => void;
  geneExpressionData: UseGeneExpressionReturn;
  sortedFilteredData: PointMetadata[];
  setSortedFilteredData: (data: PointMetadata[]) => void;
  scale: "linearTPM" | "logTPM";
  setScale: (newScale: "linearTPM" | "logTPM") => void;
  replicates: "mean" | "all";
  setReplicates: (newReplicates: "mean" | "all") => void;
  viewBy: "byTissueMaxTPM" | "byExperimentTPM" | "byTissueTPM";
  setViewBy: (newView: "byTissueMaxTPM" | "byExperimentTPM" | "byTissueTPM") => void;
  RNAtype: "all" | "polyA plus RNA-seq" | "total RNA-seq";
  setRNAType: (newType: "all" | "polyA plus RNA-seq" | "total RNA-seq") => void;
  ref?: React.RefObject<DownloadPlotHandle>;
  isV40?: boolean;
};

const GeneExpression = (props: GeneExpressionProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([]);
  const [sortedFilteredData, setSortedFilteredData] = useState<PointMetadata[]>([]);
  const [scale, setScale] = useState<"linearTPM" | "logTPM">("linearTPM")
  const [replicates, setReplicates] = useState<"mean" | "all">("mean")
  const [viewBy, setViewBy] = useState<"byTissueMaxTPM" | "byExperimentTPM" | "byTissueTPM">("byExperimentTPM")
  const [RNAtype, setRNAType] = useState<"all" | "polyA plus RNA-seq" | "total RNA-seq">(props.assembly === "GRCh38" ? "total RNA-seq" : "all")

  const barRef = useRef<DownloadPlotHandle>(null);
  const violinRef = useRef<DownloadPlotHandle>(null);
  const scatterRef = useRef<DownloadPlotHandle>(null);

  const geneExpressionData = useGeneExpression({ id: props.geneData?.data.id, assembly: props.assembly });

  const isV40 = useMemo(() => {
    const files = geneExpressionData?.data?.[0]?.gene_quantification_files?.[0];
    const hasTpm = files?.quantifications?.[0]?.tpm !== undefined;
    return Boolean(geneExpressionData?.data?.length) && !hasTpm;
  }, [geneExpressionData?.data]);

  const rows: PointMetadata[] = useMemo(() => {
    if (!geneExpressionData?.data?.length || isV40) return [];

    const filteredData = geneExpressionData.data.filter(d => RNAtype === "all" || d.assay_term_name === RNAtype)

    let result: PointMetadata[] = filteredData.flatMap((entry) => {
      const files = entry.gene_quantification_files?.filter(Boolean) ?? [];

      if (replicates === "all") {
        return files.flatMap((file, i) => {
          const quants = file.quantifications?.filter(Boolean) ?? [];
          const quant = quants[0]

          const rawTPM = quant?.tpm;
          const scaledTPM =
            scale === "logTPM" ? Math.log10(rawTPM + 1) : rawTPM;

          const repLabel = file.biorep != null ? ` rep. ${file.biorep}` : "";
          const modifiedAccession = `${entry.accession}${repLabel}`;

          return {
            ...entry,
            accession: modifiedAccession,
            gene_quantification_files: [
              {
                ...file,
                quantifications: [
                  {
                    ...quant,
                    tpm: scaledTPM,
                  },
                ],
              },
            ],
          };
        });
      } else {
        // replicates === "mean"
        const allQuants = files.flatMap(
          (file) => file.quantifications?.filter(Boolean) ?? []
        );
        if (!allQuants.length) return [];

        const avgTPM =
          allQuants.reduce((sum, q) => sum + q?.tpm, 0) / allQuants.length;

        const scaledTPM =
          scale === "logTPM" ? Math.log10(avgTPM + 1) : avgTPM;

        return [
          {
            ...entry,
            gene_quantification_files: [
              {
                accession: files[0]?.accession,
                biorep: null,
                quantifications: [
                  {
                    __typename: "GeneQuantification",
                    file_accession: "average",
                    tpm: scaledTPM,
                  },
                ],
                __typename: "GeneQuantificationFile",
              },
            ],
          },
        ];
      }
    });

    return result;
  }, [geneExpressionData.data, isV40, RNAtype, replicates, scale]);

  const SharedGeneExpressionPlotProps: SharedGeneExpressionPlotProps = useMemo(
    () => ({
      rows,
      selected,
      setSelected,
      sortedFilteredData,
      setSortedFilteredData,
      scale,
      setScale,
      replicates,
      setReplicates,
      viewBy,
      setViewBy,
      RNAtype,
      setRNAType,
      geneExpressionData,
      ...props,
    }),
    [rows, selected, sortedFilteredData, scale, replicates, viewBy, RNAtype, geneExpressionData, props]
  );

  return (
    <>
    {isV40 && <VersionFallback gene={props.geneData.data.name} />}
    <TwoPaneLayout
      TableComponent={<GeneExpressionTable {...SharedGeneExpressionPlotProps} />}
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <GeneExpressionBarPlot ref={barRef} {...SharedGeneExpressionPlotProps} isV40={isV40} />
          ),
          ref: barRef,
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <GeneExpressionViolinPlot ref={violinRef} {...SharedGeneExpressionPlotProps} />
          ),
          ref: violinRef,
        },
        {
          tabTitle: "UMAP",
          icon: <ScatterPlot />,
          plotComponent: (
            <GeneExpressionUMAP ref={scatterRef} {...SharedGeneExpressionPlotProps} />
          ),
          ref: scatterRef,
        },
      ]}
      isV40={isV40}
    />
    </>
  );

};

export default GeneExpression;
