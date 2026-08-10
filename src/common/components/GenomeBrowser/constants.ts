export const humanChromStates = {
  ["TssFlnk"]: { description: "Flanking TSS", stateno: "E1", color: "#FF4500" },
  ["TssFlnkD"]: {
    description: "Flanking TSS downstream",
    stateno: "E2",
    color: "#FF4500",
  },
  ["TssFlnkU"]: {
    description: "Flanking TSS upstream",
    stateno: "E3",
    color: "#FF4500",
  },
  ["Tss"]: { description: "Active TSS", stateno: "E4", color: "#FF0000" },
  ["Enh1"]: { description: "Enhancer", stateno: "E5", color: "#FFDF00" },
  ["Enh2"]: { description: "Enhancer", stateno: "E6", color: "#FFDF00" },
  ["EnhG1"]: {
    description: "Enhancer in gene",
    stateno: "E7",
    color: "#AADF07",
  },
  ["EnhG2"]: {
    description: "Enhancer in gene",
    stateno: "E8",
    color: "#AADF07",
  },
  ["TxWk"]: {
    description: "Weak transcription",
    stateno: "E9",
    color: "#3F9A50",
  },
  ["Biv"]: { description: "Bivalent", stateno: "E10", color: "#CD5C5C" },
  ["ReprPC"]: {
    description: "Repressed by Polycomb",
    stateno: "E11",
    color: "#8937DF",
  },
  ["Quies"]: { description: "Quiescent", stateno: "E12", color: "#DCDCDC" },
  ["Het"]: { description: "Heterochromatin", stateno: "E13", color: "#4B0082" },
  ["ZNF/Rpts"]: {
    description: "ZNF genes repreats",
    stateno: "E14",
    color: "#68cdaa",
  },
  ["Tx"]: { description: "Transcription", stateno: "E15", color: "#008000" },
};

export const mouseChromStates = {
  ["TssA"]: { description: "Active TSS", color: "#FF0000" },
  ["TssAFlnk1"]: { description: "Active TSS Flanking 1", color: "#FF4500" },
  ["TssAFlnk2"]: { description: "Active TSS Flanking 2", color: "#FF4500" },
  ["TssBiv"]: { description: "Bivalent TSS", color: "#CD5C5C" },
  ["Enh"]: { description: "Strong Enhancer", color: "#FFDF00" },
  ["EnhLo1"]: { description: "Low Signal Enhancer 1", color: "#F0E68C" },
  ["EnhLo2"]: { description: "Low Signal Enhancer 2", color: "#F0E68C" },
  ["EnhPois1"]: { description: "Poised Enhancer 1", color: "#DAA520" },
  ["EnhPois2"]: { description: "Poised Enhancer 2", color: "#DAA520" },
  ["Tx1"]: { description: "Strong Transcription", color: "#008000" },
  ["Tx2"]: { description: "Weak Transcription", color: "#3F9A50" },
  ["HetCons"]: { description: "Constitutive Heterochromatin", color: "#4B0082" },
  ["HetFac"]: { description: "Facultative Heterochromatin", color: "#800080" },
  ["Quies"]: { description: "Quiescent", color: "#DCDCDC" },
  ["QuiesG"]: { description: "Quiescent in Gene", color: "#C0C0C0" },
};
