"use client";
import { InfoOutlineRounded } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { GridColDef, Table } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreData } from "common/hooks/useCcreData";
import { useSnpData } from "common/hooks/useSnpData";
import { useMemo, useState } from "react";
import { DistanceSlider } from "./DistanceSlider";
import { calcSignedDistRegionToRegion } from "common/utility";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { classificationFormatting } from "common/components/ClassificationFormatting";

const VariantLinkedCcres = ({ entity }: EntityViewComponentProps) => {
  const {
    data: variantData,
    loading: variantLoading,
    error: variantError,
  } = useSnpData({ rsID: entity.entityID, assembly: entity.assembly });

  const [distance, setDistance] = useState<number>(500);

  const handleDistanceChange = (distance: number) => {
    setDistance(distance);
  };

  const searchCoordinates = useMemo(() => {
    if (!variantData?.coordinates) return null;

    const { chromosome, start, end } = variantData.coordinates;
    return {
      chromosome,
      start: start - distance,
      end: end + distance,
    };
  }, [variantData, distance]);

  const {
    data: dataCcres,
    loading: loadingCcres,
    error: errorCcres,
  } = useCcreData({
    coordinates: searchCoordinates,
    assembly: "GRCh38",
    skip: !searchCoordinates,
  });

  const nearbyccres = dataCcres?.map((d) => {
    return {
      ccre: d?.info.accession,
      chromosome: d?.chrom,
      start: d?.start,
      end: d?.start + d?.len,
      group: d?.pct,
      distance: calcSignedDistRegionToRegion(variantData.coordinates, { start: d?.start, end: d?.start + d?.len }),
    };
  });

  const cols: GridColDef[] = [
    {
      field: "ccre",
      headerName: "Accession",
      renderCell: (params) => {
        return <LinkComponent href={`/GRCh38/ccre/${params.value}`}>{params.value}</LinkComponent>;
      },
    },
    {
      field: "group",
      headerName: "Classification",
      ...classificationFormatting,
    },
    {
      field: "chromosome",
      headerName: "Chromosome",
    },
    {
      field: "start",
      headerName: "Start",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "end",
      headerName: "End",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "distance",
      headerName: "Distance",
      renderHeader: () => (
        <>
          Distance from&nbsp;<i>{entity.entityID}</i>
        </>
      ),
      type: "number",
      renderCell: ({ value }) => {
        if (value == null) return "";
        const direction = value === 0 ? "" : value < 0 ? "-" : "+";
        const absValue = Math.abs(value);
        return <span>{`${direction}${absValue.toLocaleString()}`}</span>;
      },
      sortComparator: (v1, v2) => Math.abs(v1) - Math.abs(v2),
    },
  ];

  return (
    <Table
      rows={nearbyccres}
      columns={cols}
      label={`Nearby cCREs`}
      loading={variantLoading || loadingCcres}
      error={!!(errorCcres || variantError)}
      initialState={{
        sorting: {
          sortModel: [{ field: "distance", sort: "asc" }],
        },
      }}
      emptyTableFallback={
        <Stack
          direction={"row"}
          border={"1px solid #e0e0e0"}
          borderRadius={1}
          p={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} spacing={1}>
            <InfoOutlineRounded />
            <Typography>
              No Nearby cCREs Found Within {distance}bp of {entity.entityID}
            </Typography>
          </Stack>
          <DistanceSlider distance={distance} handleDistanceChange={handleDistanceChange} />
        </Stack>
      }
      divHeight={{ maxHeight: "600px" }}
      toolbarSlot={<DistanceSlider distance={distance} handleDistanceChange={handleDistanceChange} />}
      labelTooltip={
        <Typography component="span" variant="subtitle2">
          (Within {distance}bp of {entity.entityID})
        </Typography>
      }
    />
  );
};

export default VariantLinkedCcres;
