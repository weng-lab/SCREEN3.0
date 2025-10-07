import { InfoOutlineRounded } from "@mui/icons-material";
import { Box, Slider, Stack, Tooltip, Typography } from "@mui/material";
import { GridColDef, Table } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreData } from "common/hooks/useCcreData";
import { UseSnpDataReturn } from "common/hooks/useSnpData";
import { useMemo, useState } from "react";
import { Assembly, GenomicRange } from "types/globalTypes";
import { DistanceSlider } from "./DistanceSlider";
import { calcSignedDistRegionToRegion } from "common/utility";

const VariantLinkedCcres = ({
    variantData,
}: {
    variantData: UseSnpDataReturn<{
        coordinates: GenomicRange | GenomicRange[];
        assembly: Assembly;
    }>;
}) => {
    const [distance, setDistance] = useState<number>(500);

    const handleDistanceChange = (distance: number) => {
        setDistance(distance);
    }

    const coordinates = useMemo(() => {
        if (!variantData.data[0]?.coordinates) return undefined;

        const { chromosome, start, end } = variantData.data[0].coordinates;
        return {
            chromosome,
            start: start - distance,
            end: end + distance,
        };
    }, [variantData.data, distance]);

    const {
        data: dataCcres,
        loading: loadingCcres,
    } = useCcreData({
        coordinates,
        assembly: "GRCh38",
    });

    const nearbyccres = dataCcres
        ?.map((d) => {
            return {
                ccre: d?.info.accession,
                chromosome: d?.chrom,
                start: d?.start,
                end: d?.start + d?.len,
                group: d?.pct,
                distance: calcSignedDistRegionToRegion({start: variantData.data[0].coordinates.start, end: variantData.data[0].coordinates.end}, {start: d?.start, end: d?.start + d?.len}),
            };
        })

    const cols: GridColDef[] = [
        {
            field: "ccre",
            headerName: "Accession",
            renderCell: (params) => {
                return (
                    <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
                        {params.value}
                    </LinkComponent>
                );
            },
        },
        {
            field: "group",
            headerName: "Class",
            renderCell: (params) => (
                <Tooltip
                    title={
                        <div>
                            See{" "}
                            <LinkComponent
                                openInNewTab
                                color="inherit"
                                showExternalIcon
                                href="https://screen.wenglab.org/about#classifications"
                            >
                                SCREEN
                            </LinkComponent>{" "}
                            for Class definitions
                        </div>
                    }
                >
                    <span>{params.value}</span>
                </Tooltip>
            ),
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
                    Distance from&nbsp;<i>{variantData.data[0]?.id}</i>
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
        <Box width={"100%"}>
            <Table
                rows={nearbyccres}
                columns={cols}
                label={`Nearby cCREs`}
                loading={variantData.loading || loadingCcres}
                initialState={{
                    sorting: {
                        sortModel: [{ field: "distance", sort: "asc" }],
                    },
                }}
                emptyTableFallback={
                    <Stack direction={"row"} border={"1px solid #e0e0e0"} borderRadius={1} p={2} alignItems={"center"} justifyContent={"space-between"}>
                        <Stack direction={"row"} spacing={1}>
                            <InfoOutlineRounded />
                            <Typography>No Nearby cCREs Found Within {distance}bp of {variantData.data[0]?.id}</Typography>
                        </Stack>
                        <DistanceSlider
                            distance={distance}
                            handleDistanceChange={handleDistanceChange}
                        />
                    </Stack>
                }
                divHeight={{ maxHeight: "600px" }}
                toolbarSlot={
                    <DistanceSlider
                        distance={distance}
                        handleDistanceChange={handleDistanceChange}
                    />
                }
                labelTooltip={
                    <Typography component="span" variant="subtitle2">(Within {distance}bp of {variantData.data[0]?.id})</Typography>
                }
            />
        </Box>
    );
};

export default VariantLinkedCcres;
