import { ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionSummary, AccordionDetails, Typography, AccordionProps, List, ListItem } from "@mui/material"

export type ActiveCellTypesAccordionProps = {
  celltypes: string[],
  assay: "DNase" | "ATAC",
  accordionProps?: Partial<AccordionProps>
}

const ActiveCellTypesAccordion = ({celltypes, assay, accordionProps}: ActiveCellTypesAccordionProps) => {
  const uniqueCelltypes = getUniqueCellTypes(celltypes)
  return (
    <Accordion {...accordionProps}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        {assay} - {uniqueCelltypes.length} Active Cell Types
      </AccordionSummary>
      <AccordionDetails>
        <List disablePadding sx={{listStyleType: 'disc', pl: 2}}>
          {uniqueCelltypes.map((celltype, i) => (
            <Typography component={ListItem} display={"list-item"} disablePadding variant="body2" key={i}>
              {`${celltype[0]} - (${celltype[1]})`}
            </Typography>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

const getUniqueCellTypes = (celltypes: string[]): [cell: string, stimulation: string][] => {
  return celltypes.reduce((prev, curr) => {
    const cell = curr.split("-")[0]
    const stimulation = curr.split("-")[1]
    const existingEntry = prev.find(x => x[0] === cell)

    if (existingEntry){
      return [...prev.filter(y => y !== existingEntry), [cell, existingEntry[1] + ', ' + stimulation]]
    } else return [...prev, [cell, stimulation]]
  }, [])
}

export default ActiveCellTypesAccordion