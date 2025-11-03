"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [684],
    {
        1552: (e, n, t) => {
            t.d(n, { z: () => a });
            let a = (e) => "GRCh38" === e || "mm10" === e;
        },
        1684: (e, n, t) => {
            t.d(n, {
                W5: () => d,
                XZ: () => p,
                // undefined here
                Zr: () => o,
                ew: () => f,
                gg: () => y,
                i: () => h,
                kR: () => c,
                oE: () => u,
                pk: () => g,
                po: () => C,
                sz: () => x,
                xi: () => m,
                yE: () => b,
            });
            var a = t(95155),
                r = t(80317),
                l = t(56085),
                s = t(96758),
                i = t(57450);
            let o = (e) => e.charAt(0).toUpperCase() + e.slice(1);
            function c(e) {
                return e.replace(/\b\w/g, (e) => e.toUpperCase());
            }
            let d = (e, n) => (e.length <= n ? e : e.slice(0, n - 3) + "...");
            function u(e) {
                return e.includes("%3A")
                    ? {
                          chromosome: e.split("%3A")[0],
                          start: +e.split("%3A")[1].split("-")[0],
                          end: +e.split("%3A")[1].split("-")[1],
                      }
                    : {
                          chromosome: e.split(":")[0],
                          start: +e.split(":")[1].split("-")[0],
                          end: +e.split(":")[1].split("-")[1],
                      };
            }
            function h(e) {
                switch (e) {
                    case "variant":
                        return "Variant";
                    case "gene":
                        return "Gene";
                    case "ccre":
                        return "cCRE";
                    case "region":
                        return "Region";
                    case "gwas":
                        return "GWAS Study";
                    default:
                        return null;
                }
            }
            function m(e) {
                return ""
                    .concat(e.chromosome, ":")
                    .concat(e.start.toLocaleString(), "-")
                    .concat(e.end.toLocaleString());
            }
            let p = (e) => {
                switch (e) {
                    case "atac":
                        return "ATAC";
                    case "ctcf":
                        return "CTCF";
                    case "dnase":
                        return "DNase";
                    case "h3k27ac":
                        return "H3K27ac";
                    case "h3k4me3":
                        return "H3K4me3";
                }
            };
            function g(e, n, t) {
                if (e > 0.01) return (0, a.jsx)(r.default, { ...t, children: e.toFixed(2) });
                let [l, s] = e.toExponential(n).split("e");
                return (0, a.jsxs)(r.default, {
                    ...t,
                    children: [l, "\xa0\xd7\xa010", (0, a.jsx)("sup", { children: s })],
                });
            }
            function x(e, n, t, a) {
                return n
                    .map((n) => {
                        let r,
                            l = "+" === t ? n.coordinates.start : n.coordinates.end,
                            s = (function (e, n, t, a) {
                                let r = Math.abs(e - a),
                                    l = Math.abs(n - a),
                                    s = Math.abs(Math.floor((e + n) / 2) - a);
                                if (e <= a && a <= n) return 0;
                                switch (t) {
                                    case "start":
                                        return r;
                                    case "end":
                                        return l;
                                    case "middle":
                                        return s;
                                    case "closest":
                                        return Math.min(r, l, s);
                                }
                            })(e.start, e.end, a, l);
                        return (
                            (r =
                                "+" === t
                                    ? e.end < l
                                        ? "Upstream"
                                        : "Downstream"
                                    : e.start > l
                                      ? "Upstream"
                                      : "Downstream"),
                            { transcriptId: n.id, distance: s, direction: r }
                        );
                    })
                    .reduce((e, n) => (n.distance < e.distance ? n : e));
            }
            function f(e, n, t) {
                return n
                    .map((n) => {
                        var a, r;
                        let l = "+" === t ? n.coordinates.start : n.coordinates.end;
                        return (
                            (a = e),
                            (r = { start: l, end: l }),
                            a.end < r.start ? r.start - a.end : r.end < a.start ? a.start - r.end : 0
                        );
                    })
                    .includes(0);
            }
            function C(e, n) {
                return n.end < e.start ? n.end - e.start : n.start > e.end ? n.start - e.end : 0;
            }
            function y(e) {
                return (0, s.decompressFromEncodedURIComponent)(e)
                    .split(",")
                    .map((e) => {
                        let [n, t, a, r = ""] = e.split("/"),
                            s = { assembly: N[n], entityType: v(t), entityID: a, tab: R(r) };
                        return (0, l.Kt)(s) ? s : null;
                    })
                    .filter((e) => null !== e && e.entityID);
            }
            function b(e) {
                return (0, s.compressToEncodedURIComponent)(
                    e.map((e) => [E[e.assembly], S(e.entityType), e.entityID, j(e.tab)].join("/")).join(",")
                );
            }
            let S = (e) => String([...new Set(Object.values(i.ve).flat())].indexOf(e)),
                v = (e) => [...new Set(Object.values(i.ve).flat())][+e],
                j = (e) =>
                    String(
                        Object.values(i.Ib)
                            .map((e) => Object.values(e))
                            .flat(2)
                            .map((e) => e.route)
                            .indexOf(e)
                    ),
                R = (e) =>
                    Object.values(i.Ib)
                        .map((e) => Object.values(e))
                        .flat(2)
                        .map((e) => e.route)[+e],
                E = { GRCh38: "h", mm10: "m" },
                N = Object.fromEntries(
                    Object.entries(E).map((e) => {
                        let [n, t] = e;
                        return [t, n];
                    })
                );
        },
        2369: (e, n, t) => {
            t.d(n, { z: () => l });
            var a = t(40650);
            let r = (0, t(78224).J)(
                    "\n  query getGWASStudies($study: [String]){  \n    getAllGwasStudies(study: $study)  \n    {        \n        study\n        studyname\n        totalldblocks\n        author\n        pubmedid\n    }\n}\n"
                ),
                l = (e) => {
                    let { study: n, entityType: t } = e,
                        {
                            data: l,
                            loading: s,
                            error: i,
                        } = (0, a.IT)(r, { variables: { study: n }, skip: void 0 !== t && "gwas" !== t });
                    return { data: null == l ? void 0 : l.getAllGwasStudies[0], loading: s, error: i };
                };
        },
        3205: (e, n, t) => {
            t.d(n, { default: () => $ });
            var a = t(95155),
                r = t(96869),
                l = t(97179),
                s = t(43791),
                i = t(40650);
            let o = (0, t(81362).J1)(
                "\n  query LinkedCcres($geneid: [String!]!, $assembly: String!) {\n    linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {\n      accession\n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      displayname\n      __typename\n    }\n  }\n"
            );
            var c = t(29726),
                d = t(38083),
                u = t(20063),
                h = t(51760);
            let m = (e) => ({
                field: "accession",
                headerName: "Accession",
                renderCell: (n) =>
                    (0, a.jsx)(h.g, { href: "/".concat(e, "/ccre/").concat(n.value), children: n.value }),
            });
            function p(e) {
                let { geneData: n } = e,
                    {
                        data: t,
                        loading: r,
                        error: h,
                    } = (function (e) {
                        let { geneid: n } = e,
                            {
                                data: t,
                                loading: a,
                                error: r,
                            } = (0, i.IT)(o, {
                                variables: { geneid: [n.split(".")[0]], assembly: "grch38" },
                                skip: !n,
                            });
                        return { data: null == t ? void 0 : t.linkedcCREs, loading: a, error: r };
                    })({ geneid: null == n ? void 0 : n.data.id }),
                    p = (0, u.usePathname)().split("/")[1];
                if (n.loading || r)
                    return (0, a.jsxs)(l.A, {
                        container: !0,
                        spacing: 2,
                        width: "100%",
                        children: [
                            (0, a.jsx)(l.A, {
                                size: 12,
                                children: (0, a.jsx)(s.A, { variant: "rounded", width: "100%", height: 300 }),
                            }),
                            (0, a.jsx)(l.A, {
                                size: 12,
                                children: (0, a.jsx)(s.A, { variant: "rounded", width: "100%", height: 300 }),
                            }),
                            (0, a.jsx)(l.A, {
                                size: 12,
                                children: (0, a.jsx)(s.A, { variant: "rounded", width: "100%", height: 300 }),
                            }),
                            (0, a.jsx)(l.A, {
                                size: 12,
                                children: (0, a.jsx)(s.A, { variant: "rounded", width: "100%", height: 300 }),
                            }),
                        ],
                    });
                if (h) throw Error(JSON.stringify(h));
                let g = t.filter((e) => "Intact-HiC" === e.assay).map((e, n) => ({ ...e, id: n.toString() })),
                    x = t
                        .filter((e) => "RNAPII-ChIAPET" === e.assay || "CTCF-ChIAPET" === e.assay)
                        .map((e, n) => ({ ...e, id: n.toString() })),
                    f = t.filter((e) => "CRISPR" === e.method).map((e, n) => ({ ...e, id: n.toString() })),
                    C = t.filter((e) => "eQTLs" === e.method).map((e, n) => ({ ...e, id: n.toString() })),
                    y = [
                        {
                            label: "Intact Hi-C Loops",
                            rows: g,
                            columns: [m(p), ...c.gW.slice(2)],
                            sortColumn: "p_val",
                            sortDirection: "asc",
                            emptyTableFallback: "No intact Hi-C loops overlap a cCRE and the promoter of this gene",
                        },
                        {
                            label: "ChIA-PET",
                            rows: x,
                            columns: [m(p), ...c.gI.slice(2)],
                            sortColumn: "score",
                            sortDirection: "desc",
                            emptyTableFallback: "No ChIA-PET interactions overlap a cCRE and the promoter of this gene",
                        },
                        {
                            label: "CRISPRi-FlowFISH",
                            rows: f,
                            columns: [m(p), ...c.zI.slice(2)],
                            sortColumn: "p_val",
                            sortDirection: "asc",
                            emptyTableFallback:
                                "No cCREs targeted in a CRISPRi-FlowFISH experiment were linked to this gene",
                        },
                        {
                            label: "eQTLs",
                            rows: C,
                            columns: [m(p), ...c.CY.slice(2)],
                            sortColumn: "p_val",
                            sortDirection: "asc",
                            emptyTableFallback:
                                "No cCREs overlap variants associated with significant changes in expression of this gene",
                        },
                    ];
                return (0, a.jsx)(d.A, { tables: y });
            }
            var g = t(50301),
                x = t(80357),
                f = t(80317),
                C = t(64647),
                y = t(80207),
                b = t(12115);
            let S = (0, y.J1)(
                    "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n\n  }\n}"
                ),
                v = (0, y.J1)(
                    "\nquery getclosestGenetocCRE($geneid: [String],$ccre: [String]) {\n  closestGenetocCRE(geneid: $geneid,ccre: $ccre) {\n     gene {\n      chromosome\n      stop\n      start\n      name\n      type\n    }\n    ccre\n    chromosome\n    stop\n    start\n  }\n}\n  "
                ),
                j = (0, y.J1)(
                    "\n    query cCREQuery(\n      $assembly: String!\n      $coordinates: [GenomicRangeInput]\n    ) {\n      cCRESCREENSearch(\n        assembly: $assembly\n        coordinates: $coordinates\n      ) {\n        chrom\n        start\n        len\n        pct\n        info {\n          accession\n        }\n        ctcf_zscore\n        dnase_zscore\n        enhancer_zscore\n        promoter_zscore\n        atac_zscore\n        nearestgenes {\n          gene        \n          distance\n        }\n        ctspecific {\n          ct\n          dnase_zscore\n          h3k4me3_zscore\n          h3k27ac_zscore\n          ctcf_zscore\n          atac_zscore\n        }  \n      }\n    }\n  "
                );
            var R = t(82293),
                E = t(83982),
                N = t(8559),
                A = t(92988),
                w = t(71745),
                T = t(75970),
                k = t(62995),
                _ = t(56919),
                I = t(7291),
                M = t(1123),
                F = t(66800);
            let G = (e) => "".concat(e, "kb"),
                P = [
                    { value: 0, label: "0kb" },
                    { value: 1e4, label: "10kb" },
                    { value: 25e3, label: "25kb" },
                    { value: 5e4, label: "50kb" },
                    { value: 1e5, label: "100kb" },
                ],
                D = (e) => {
                    let {
                        open: n,
                        anchorEl: t,
                        handleClickAway: l,
                        geneName: s,
                        calcMethod: i,
                        handleMethodChange: o,
                        distance: c,
                        handleDistanceChange: d,
                        assembly: u,
                    } = e;
                    return (0, a.jsx)(A.A, {
                        open: n,
                        anchorEl: t,
                        placement: "bottom-start",
                        disablePortal: !0,
                        sx: { zIndex: 10 },
                        children: (0, a.jsx)(w.x, {
                            onClickAway: l,
                            children: (0, a.jsx)(T.A, {
                                elevation: 8,
                                sx: { minWidth: 200 },
                                children: (0, a.jsxs)(x.default, {
                                    sx: { p: 2 },
                                    children: [
                                        (0, a.jsx)(f.default, {
                                            sx: { mb: 2 },
                                            children: "Calculate Nearby cCREs by:",
                                        }),
                                        (0, a.jsx)(r.default, {
                                            direction: "row",
                                            spacing: 2,
                                            children: (0, a.jsx)(k.A, {
                                                children: (0, a.jsxs)(_.A, {
                                                    row: !0,
                                                    value: i,
                                                    onChange: (e) => o(e.target.value),
                                                    children: [
                                                        (0, a.jsx)(I.A, {
                                                            value: "tss",
                                                            control: (0, a.jsx)(M.A, {}),
                                                            label: (0, a.jsxs)(a.Fragment, {
                                                                children: [
                                                                    "Within Distance of TSS of ",
                                                                    (0, a.jsx)("i", { children: s }),
                                                                ],
                                                            }),
                                                        }),
                                                        (0, a.jsx)(I.A, {
                                                            value: "body",
                                                            control: (0, a.jsx)(M.A, {}),
                                                            label: (0, a.jsxs)(a.Fragment, {
                                                                children: [
                                                                    (0, a.jsx)("i", { children: s }),
                                                                    " Gene Body",
                                                                ],
                                                            }),
                                                        }),
                                                        "GRCh38" === u &&
                                                            (0, a.jsx)(I.A, {
                                                                value: "3gene",
                                                                control: (0, a.jsx)(M.A, {}),
                                                                label: "Closest 3 Genes",
                                                            }),
                                                    ],
                                                }),
                                            }),
                                        }),
                                        (0, a.jsx)(x.default, {
                                            sx: { width: "100%", padding: 2 },
                                            children: (0, a.jsx)(F.Ay, {
                                                "aria-label": "Custom marks",
                                                defaultValue: 0,
                                                getAriaValueText: G,
                                                valueLabelDisplay: "auto",
                                                min: 0,
                                                max: 1e5,
                                                step: null,
                                                value: c,
                                                onChange: (e, n) => d(n),
                                                marks: P,
                                                disabled: "tss" !== i,
                                            }),
                                        }),
                                    ],
                                }),
                            }),
                        }),
                    });
                };
            var H = t(12434),
                B = t(1684),
                z = t(77406);
            function L(e) {
                let { geneData: n, assembly: t } = e,
                    [l, s] = (0, b.useState)("tss"),
                    [o, c] = (0, b.useState)(1e4),
                    { data: d, loading: u } = (function (e, n, t, a) {
                        var r;
                        let l = (0, b.useMemo)(() => {
                                if (e)
                                    if ("tss" === n) {
                                        var t, r;
                                        return (
                                            (t = e.data.transcripts),
                                            (r = a),
                                            0 === t.length
                                                ? []
                                                : t.map((e) => {
                                                      let n =
                                                          "+" === e.strand ? e.coordinates.start : e.coordinates.end;
                                                      return {
                                                          chromosome: e.coordinates.chromosome,
                                                          start: Math.max(0, n - r),
                                                          end: n + r,
                                                      };
                                                  })
                                        );
                                    } else {
                                        if ("body" !== n) return [];
                                        let { __typename: t, ...a } = e.data.coordinates;
                                        return [a];
                                    }
                            }, [e, a, n]),
                            { data: s, loading: o } = (0, i.IT)(j, {
                                variables: { assembly: t, coordinates: l },
                                skip: 0 === l.length || "3gene" === n,
                            }),
                            {
                                data: c,
                                loading: d,
                                error: u,
                            } = (0, i.IT)(v, {
                                variables: { geneid: [e.data.id.split(".")[0]] },
                                skip: !e || "3gene" !== n,
                            }),
                            h =
                                "3gene" === n
                                    ? [...new Set(null == c ? void 0 : c.closestGenetocCRE.map((e) => e.ccre))]
                                    : [
                                          ...new Set(
                                              null == s ? void 0 : s.cCRESCREENSearch.map((e) => e.info.accession)
                                          ),
                                      ],
                            { data: m } = (0, i.IT)(S, {
                                variables: { assembly: t, includeiCREs: !0, accession: h },
                                skip: "3gene" === n ? d || !c : o || !s,
                            }),
                            p = {};
                        (null == m || null == (r = m.cCREAutocompleteQuery) ? void 0 : r.length) > 0 &&
                            m.cCREAutocompleteQuery.forEach((e) => {
                                p[e.accession] = e.isiCRE;
                            });
                        let g = [];
                        return (
                            "3gene" === n && c
                                ? (g = Object.values(
                                      c.closestGenetocCRE.reduce((e, n) => ({ ...e, [n.ccre]: n }), {})
                                  ).map((e) => {
                                      var n;
                                      return { ...e, isiCRE: null != (n = p[e.ccre]) && n };
                                  }))
                                : s &&
                                  (g = s.cCRESCREENSearch.map((e) => {
                                      var n;
                                      return {
                                          ...e,
                                          ccre: e.info.accession,
                                          isiCRE: null != (n = p[e.info.accession]) && n,
                                      };
                                  })),
                            { data: g, loading: "3gene" === n ? d : o, error: u }
                        );
                    })(n, l, t, o),
                    [m, p] = b.useState(null),
                    y = (e) => {
                        if (m) p(null);
                        else {
                            let n = e.currentTarget.getBoundingClientRect();
                            p({ getBoundingClientRect: () => n });
                        }
                    },
                    { data: A, loading: w } = (0, R.H)({
                        accession: null == d ? void 0 : d.map((e) => e.ccre),
                        assembly: t,
                    }),
                    T =
                        null == d
                            ? void 0
                            : d.map((e) => {
                                  let t = null == A ? void 0 : A.find((n) => n.info.accession === e.ccre),
                                      a = (0, B.sz)(
                                          {
                                              chromosome: null == t ? void 0 : t.chrom,
                                              start: null == t ? void 0 : t.start,
                                              end: (null == t ? void 0 : t.start) + (null == t ? void 0 : t.len),
                                          },
                                          n.data.transcripts,
                                          n.data.strand,
                                          "closest"
                                      );
                                  return {
                                      ...e,
                                      chromosome: null == t ? void 0 : t.chrom,
                                      start: null == t ? void 0 : t.start,
                                      end: (null == t ? void 0 : t.start) + (null == t ? void 0 : t.len),
                                      group: null == t ? void 0 : t.pct,
                                      distance:
                                          "tss" === l
                                              ? a.distance
                                              : Math.abs((null == t ? void 0 : t.start) - e.start) || 0,
                                      direction: a.direction,
                                      tss: a.transcriptId,
                                  };
                              }),
                    k = [
                        {
                            field: "ccre",
                            headerName: "Accession",
                            renderCell: (e) =>
                                (0, a.jsx)(h.g, { href: "/".concat(t, "/ccre/").concat(e.value), children: e.value }),
                        },
                        {
                            field: "group",
                            headerName: "Class",
                            renderCell: (e) => {
                                var n;
                                return (0, a.jsx)(g.A, {
                                    title: (0, a.jsxs)("div", {
                                        children: [
                                            "See",
                                            " ",
                                            (0, a.jsx)(h.g, {
                                                openInNewTab: !0,
                                                color: "inherit",
                                                showExternalIcon: !0,
                                                href: "https://screen.wenglab.org/about#classifications",
                                                children: "SCREEN",
                                            }),
                                            " ",
                                            "for Class definitions",
                                        ],
                                    }),
                                    children: (0, a.jsx)("span", { children: null != (n = z.Td[e.value]) ? n : "" }),
                                });
                            },
                        },
                        { field: "chromosome", headerName: "Chromosome" },
                        {
                            field: "start",
                            headerName: "Start",
                            type: "number",
                            valueFormatter: (e) => (null == e ? "" : e.toLocaleString()),
                        },
                        {
                            field: "end",
                            headerName: "End",
                            type: "number",
                            valueFormatter: (e) => (null == e ? "" : e.toLocaleString()),
                        },
                        ...("tss" === l ? [{ field: "tss", headerName: "Nearest TSS" }] : []),
                        {
                            field: "distance",
                            headerName: "Distance",
                            renderHeader: () =>
                                (0, a.jsxs)(a.Fragment, {
                                    children: [
                                        "Distance from\xa0",
                                        (0, a.jsx)("i", { children: "tss" === l ? "TSS" : n.data.name }),
                                    ],
                                }),
                            type: "number",
                            renderCell: (e) => {
                                if (null == e.value) return "";
                                let n =
                                    "tss" === l && 0 !== e.value ? ("Upstream" === e.row.direction ? "+" : "-") : "";
                                return (0, a.jsxs)("span", { children: [n, e.value.toLocaleString()] });
                            },
                        },
                    ];
                return (0, a.jsxs)(x.default, {
                    width: "100%",
                    children: [
                        (0, a.jsx)(E.XIK, {
                            rows: T,
                            columns: k,
                            label: "Nearby cCREs",
                            loading: n.loading || u || w,
                            initialState: { sorting: { sortModel: [{ field: "distance", sort: "asc" }] } },
                            emptyTableFallback: (0, a.jsxs)(r.default, {
                                direction: "row",
                                border: "1px solid #e0e0e0",
                                borderRadius: 1,
                                p: 2,
                                alignItems: "center",
                                justifyContent: "space-between",
                                children: [
                                    (0, a.jsxs)(r.default, {
                                        direction: "row",
                                        spacing: 1,
                                        children: [
                                            (0, a.jsx)(H.A, {}),
                                            (0, a.jsx)(f.default, { children: "No Nearby cCREs Found" }),
                                        ],
                                    }),
                                    (0, a.jsx)(g.A, {
                                        title: "Calculate Nearby cCREs by",
                                        children: (0, a.jsx)(C.default, {
                                            onClick: y,
                                            variant: "outlined",
                                            endIcon: (0, a.jsx)(N.A, {}),
                                            children: "Change Method",
                                        }),
                                    }),
                                ],
                            }),
                            divHeight: { maxHeight: "GRCh38" === t ? "400px" : "600px" },
                            toolbarSlot: (0, a.jsx)(g.A, {
                                title: "Calculate Nearby cCREs by",
                                children: (0, a.jsx)(C.default, {
                                    onClick: y,
                                    variant: "outlined",
                                    endIcon: (0, a.jsx)(N.A, {}),
                                    children: "Change Method",
                                }),
                            }),
                            labelTooltip: (0, a.jsxs)(a.Fragment, {
                                children: [
                                    "tss" === l &&
                                        (0, a.jsxs)(f.default, {
                                            component: "span",
                                            variant: "subtitle2",
                                            children: [
                                                "(Within ",
                                                o,
                                                " bp of TSS of ",
                                                (0, a.jsx)("i", { children: n.data.name }),
                                                ")",
                                            ],
                                        }),
                                    "3gene" === l &&
                                        (0, a.jsxs)(f.default, {
                                            component: "span",
                                            variant: "subtitle2",
                                            children: [
                                                "(",
                                                (0, a.jsx)("i", { children: n.data.name }),
                                                " is 1 of 3 closest genes to cCRE)",
                                            ],
                                        }),
                                    "body" === l &&
                                        (0, a.jsxs)(f.default, {
                                            component: "span",
                                            variant: "subtitle2",
                                            children: [
                                                "(Within ",
                                                (0, a.jsx)("i", { children: n.data.name }),
                                                " gene body)",
                                            ],
                                        }),
                                ],
                            }),
                        }),
                        (0, a.jsx)(D, {
                            open: !!m,
                            anchorEl: m,
                            handleClickAway: () => {
                                m && p(null);
                            },
                            distance: o,
                            geneName: n.data.name,
                            calcMethod: l,
                            handleDistanceChange: (e) => {
                                c(e);
                            },
                            handleMethodChange: (e) => {
                                s(e);
                            },
                            assembly: t,
                        }),
                    ],
                });
            }
            var W = t(52403);
            let $ = (e) => {
                let { entity: n } = e,
                    t = (0, W.V)({ name: n.entityID, assembly: n.assembly });
                return (0, a.jsxs)(r.default, {
                    spacing: 2,
                    children: [
                        (0, a.jsx)(L, { geneData: t, assembly: n.assembly }),
                        "GRCh38" === n.assembly && (0, a.jsx)(p, { geneData: t }),
                    ],
                });
            };
        },
        5683: (e, n, t) => {
            t.d(n, { default: () => B });
            var a = t(95155),
                r = t(36822),
                l = t(12115),
                s = t(25789),
                i = t(28278),
                o = t(24288),
                c = t(83982),
                d = t(88816),
                u = t(1684),
                h = t(79194);
            let m = (e) => {
                let {
                        rows: n,
                        selected: t,
                        setSelected: r,
                        geneExpressionData: m,
                        setSortedFilteredData: p,
                        sortedFilteredData: g,
                        viewBy: x,
                        entity: f,
                        scale: C,
                    } = e,
                    [y, b] = (0, l.useState)(!1),
                    { loading: S } = m,
                    v = (0, s.default)(),
                    j = (0, i.A)(v.breakpoints.down("sm")),
                    R = (0, l.useMemo)(() => {
                        if (!n.length) return [];
                        let e = (e) => {
                                var n;
                                return null != (n = e.tissue) ? n : "unknown";
                            },
                            t = (e) => {
                                var n, t, a, r, l;
                                return null !=
                                    (l =
                                        null == (r = e.gene_quantification_files) ||
                                        null == (a = r[0]) ||
                                        null == (t = a.quantifications) ||
                                        null == (n = t[0])
                                            ? void 0
                                            : n.tpm)
                                    ? l
                                    : 0;
                            },
                            a = n;
                        switch (x) {
                            case "byExperimentTPM":
                                a.sort((e, n) => t(n) - t(e));
                                break;
                            case "byTissueTPM": {
                                let n = a.reduce((n, a) => {
                                    var r;
                                    let l = e(a);
                                    return (n[l] = Math.max(null != (r = n[l]) ? r : -1 / 0, t(a))), n;
                                }, {});
                                a.sort((a, r) => {
                                    let l = e(a),
                                        s = n[e(r)] - n[l];
                                    return 0 !== s ? s : t(r) - t(a);
                                });
                                break;
                            }
                            case "byTissueMaxTPM": {
                                let n = a.reduce((n, a) => {
                                    let r = e(a),
                                        l = t(a);
                                    return (n[r] = Math.max(n[r] || -1 / 0, l)), n;
                                }, {});
                                (a = a.filter((a) => t(a) === n[e(a)])).sort((e, n) => t(n) - t(e));
                            }
                        }
                        return [...a];
                    }, [n, x]),
                    E = [
                        {
                            ...c.fgx,
                            sortable: !0,
                            hideable: !1,
                            renderHeader: (e) =>
                                (0, a.jsx)("div", {
                                    id: "StopPropagationWrapper",
                                    onClick: (e) => e.stopPropagation(),
                                    children: (0, a.jsx)(c.fgx.renderHeader, { ...e }),
                                }),
                        },
                        {
                            field: "biosample",
                            headerName: "Sample",
                            sortable: "byTissueTPM" !== x,
                            valueGetter: (e, n) => (0, u.Zr)(n.biosample),
                            renderCell: (e) =>
                                (0, a.jsx)("div", {
                                    style: {
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: 250,
                                    },
                                    title: e.value,
                                    children: e.value,
                                }),
                        },
                        {
                            field: " ",
                            headerName: "linearTPM" === C ? "TPM" : "Log10(TPM + 1)",
                            type: "number",
                            valueGetter: (e, n) => {
                                var t, a, r, l, s;
                                return null !=
                                    (s = (
                                        null == (l = n.gene_quantification_files) ||
                                        null == (r = l[0]) ||
                                        null == (a = r.quantifications) ||
                                        null == (t = a[0])
                                            ? void 0
                                            : t.tpm
                                    ).toFixed(2))
                                    ? s
                                    : 0;
                            },
                            sortable: "byTissueTPM" !== x,
                        },
                        { field: "tissue", headerName: "Tissue", sortable: "byTissueTPM" !== x },
                        { field: "biosample_type", headerName: "Biosample Type", sortable: "byTissueTPM" !== x },
                        {
                            field: "link",
                            headerName: "Experiment",
                            sortable: !1,
                            disableColumnMenu: !0,
                            valueGetter: (e, n) => n.accession.split(" ")[0],
                            renderCell: (e) =>
                                (0, a.jsx)(o.A, {
                                    href: "https://www.encodeproject.org/experiments/".concat(e.value, "/"),
                                    target: "_blank",
                                    size: "small",
                                    children: (0, a.jsx)(d.A, { fontSize: "small" }),
                                }),
                        },
                    ],
                    N = (0, c.bBi)(),
                    A = (0, l.useMemo)(() => (0, a.jsx)(h.A, { autoSort: y, setAutoSort: b }), [y]),
                    w = (0, l.useMemo)(() => [{ field: "tpm", sort: "desc" }], []);
                (0, l.useEffect)(() => {
                    let e = null == N ? void 0 : N.current;
                    if (!e) return;
                    let n = (null == t ? void 0 : t.length) > 0;
                    return "byTissueTPM" === x
                        ? void (y && n ? e.setSortModel([{ field: "__check__", sort: "desc" }]) : e.setSortModel([]))
                        : y
                          ? void e.setSortModel(n ? [{ field: "__check__", sort: "desc" }] : w)
                          : void e.setSortModel(w);
                }, [N, y, w, t, x]);
                let T = (0, l.useMemo)(() => ({ type: "include", ids: new Set(t.map((e) => e.accession)) }), [t]);
                return (0, a.jsx)(a.Fragment, {
                    children: (0, a.jsx)(c.XIK, {
                        apiRef: N,
                        label: "".concat(f.entityID, " Expression"),
                        rows: R,
                        columns: E,
                        loading: S,
                        pageSizeOptions: [10, 25, 50],
                        initialState: { sorting: { sortModel: w } },
                        checkboxSelection: !0,
                        getRowId: (e) => e.accession,
                        onRowSelectionModelChange: (e) => {
                            "include" === e.type
                                ? r(Array.from(e.ids).map((e) => n.find((n) => n.accession === e)))
                                : r(n);
                        },
                        rowSelectionModel: T,
                        keepNonExistentRowsSelected: !0,
                        onStateChange: () => {
                            let e = (0, c.oU)(N).map((e) => e.model);
                            ((e, n) => {
                                if (e.length !== n.length || JSON.stringify(e[0]) !== JSON.stringify(n[0])) return !1;
                                for (let t = 0; t < e.length; t++) if (e[t].accession !== n[t].accession) return !1;
                                return !0;
                            })(g, e) || p(e);
                        },
                        divHeight: { height: "100%", minHeight: j ? "none" : "580px" },
                        toolbarSlot: A,
                    }),
                });
            };
            var p = t(58260),
                g = t(80357),
                x = t(80317),
                f = t(94434),
                C = t(93320),
                y = t(96869),
                b = t(62995),
                S = t(22585),
                v = t(71583),
                j = t(35497),
                R = t(50301);
            let E = (e) => {
                    let {
                        assembly: n,
                        RNAtype: t,
                        scale: r,
                        viewBy: l,
                        replicates: s,
                        setRNAType: i,
                        setScale: o,
                        setViewBy: c,
                        setReplicates: d,
                        setSortBy: u = () => {},
                        sortBy: h = "median",
                        setShowPoints: m = () => {},
                        showPoints: p = !0,
                        violin: g = !1,
                        disabled: x = !1,
                    } = e;
                    return (0, a.jsxs)(y.default, {
                        direction: "row",
                        spacing: 2,
                        mb: 2,
                        flexWrap: "wrap",
                        children: [
                            (0, a.jsxs)(b.A, {
                                children: [
                                    (0, a.jsx)(S.A, { children: "RNA-seq Type" }),
                                    (0, a.jsxs)(v.A, {
                                        color: "primary",
                                        value: t,
                                        exclusive: !0,
                                        onChange: (e, n) => {
                                            null !== n && i(n);
                                        },
                                        "aria-label": "RNA-seq Type",
                                        size: "small",
                                        children: [
                                            (0, a.jsx)(j.A, {
                                                sx: { textTransform: "none" },
                                                value: "total RNA-seq",
                                                disabled: x,
                                                children: "Total",
                                            }),
                                            (0, a.jsx)(R.A, {
                                                title: "GRCh38" === n && "Only available in mm10",
                                                children: (0, a.jsx)("div", {
                                                    children: (0, a.jsx)(j.A, {
                                                        disabled: "GRCh38" === n || x,
                                                        sx: { textTransform: "none" },
                                                        value: "polyA plus RNA-seq",
                                                        children: "PolyA+",
                                                    }),
                                                }),
                                            }),
                                            (0, a.jsx)(R.A, {
                                                title: "GRCh38" === n && "Only available in mm10",
                                                children: (0, a.jsx)("div", {
                                                    children: (0, a.jsx)(j.A, {
                                                        disabled: "GRCh38" === n || x,
                                                        sx: { textTransform: "none" },
                                                        value: "all",
                                                        children: "All",
                                                    }),
                                                }),
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            (0, a.jsxs)(b.A, {
                                children: [
                                    (0, a.jsx)(S.A, { children: "Scale" }),
                                    (0, a.jsxs)(v.A, {
                                        color: "primary",
                                        value: r,
                                        exclusive: !0,
                                        onChange: (e, n) => {
                                            null !== n && o(n);
                                        },
                                        "aria-label": "Scale",
                                        size: "small",
                                        disabled: x,
                                        children: [
                                            (0, a.jsx)(j.A, {
                                                sx: { textTransform: "none" },
                                                value: "linearTPM",
                                                children: "Linear",
                                            }),
                                            (0, a.jsx)(j.A, {
                                                sx: { textTransform: "none" },
                                                value: "logTPM",
                                                children: "Log",
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            (0, a.jsxs)(b.A, {
                                children: [
                                    (0, a.jsx)(S.A, { children: "Replicates" }),
                                    (0, a.jsxs)(v.A, {
                                        color: "primary",
                                        value: s,
                                        exclusive: !0,
                                        onChange: (e, n) => {
                                            null !== n && d(n);
                                        },
                                        "aria-label": "Replicates",
                                        size: "small",
                                        disabled: x,
                                        children: [
                                            (0, a.jsx)(j.A, {
                                                sx: { textTransform: "none" },
                                                value: "mean",
                                                children: "Average",
                                            }),
                                            (0, a.jsx)(j.A, {
                                                sx: { textTransform: "none" },
                                                value: "all",
                                                children: "Show Replicates",
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            g
                                ? (0, a.jsxs)(y.default, {
                                      direction: "row",
                                      spacing: 2,
                                      alignItems: "center",
                                      children: [
                                          (0, a.jsxs)(b.A, {
                                              children: [
                                                  (0, a.jsx)(S.A, { children: "Sort By" }),
                                                  (0, a.jsxs)(v.A, {
                                                      color: "primary",
                                                      value: h,
                                                      exclusive: !0,
                                                      onChange: (e, n) => {
                                                          null !== n && u(n);
                                                      },
                                                      "aria-label": "View By",
                                                      size: "small",
                                                      children: [
                                                          (0, a.jsx)(j.A, {
                                                              sx: { textTransform: "none" },
                                                              value: "max",
                                                              children: "Max",
                                                          }),
                                                          (0, a.jsx)(j.A, {
                                                              sx: { textTransform: "none" },
                                                              value: "median",
                                                              children: "Median",
                                                          }),
                                                          (0, a.jsx)(j.A, {
                                                              sx: { textTransform: "none" },
                                                              value: "tissue",
                                                              children: "Tissue",
                                                          }),
                                                      ],
                                                  }),
                                              ],
                                          }),
                                          (0, a.jsxs)(b.A, {
                                              children: [
                                                  (0, a.jsx)(S.A, { children: "Show Points" }),
                                                  (0, a.jsxs)(v.A, {
                                                      color: "primary",
                                                      value: p,
                                                      exclusive: !0,
                                                      onChange: (e, n) => {
                                                          null !== n && m(n);
                                                      },
                                                      "aria-label": "show points",
                                                      size: "small",
                                                      children: [
                                                          (0, a.jsx)(j.A, {
                                                              sx: { textTransform: "none" },
                                                              value: !0,
                                                              children: "On",
                                                          }),
                                                          (0, a.jsx)(j.A, {
                                                              sx: { textTransform: "none" },
                                                              value: !1,
                                                              children: "Off",
                                                          }),
                                                      ],
                                                  }),
                                              ],
                                          }),
                                      ],
                                  })
                                : (0, a.jsxs)(b.A, {
                                      children: [
                                          (0, a.jsx)(S.A, { children: "View By" }),
                                          (0, a.jsxs)(v.A, {
                                              color: "primary",
                                              value: l,
                                              exclusive: !0,
                                              onChange: (e, n) => {
                                                  null !== n && c(n);
                                              },
                                              "aria-label": "View By",
                                              size: "small",
                                              disabled: x,
                                              children: [
                                                  (0, a.jsx)(j.A, {
                                                      sx: { textTransform: "none" },
                                                      value: "byExperimentTPM",
                                                      children: "Experiment",
                                                  }),
                                                  (0, a.jsx)(j.A, {
                                                      sx: { textTransform: "none" },
                                                      value: "byTissueTPM",
                                                      children: "Tissue",
                                                  }),
                                                  (0, a.jsx)(j.A, {
                                                      sx: { textTransform: "none" },
                                                      value: "byTissueMaxTPM",
                                                      children: "Tissue Max",
                                                  }),
                                              ],
                                          }),
                                      ],
                                  }),
                        ],
                    });
                },
                N = (e) => {
                    let {
                            scale: n,
                            selected: t,
                            setSelected: r,
                            sortedFilteredData: s,
                            RNAtype: i,
                            setRNAType: o,
                            viewBy: c,
                            setViewBy: d,
                            setScale: h,
                            replicates: m,
                            setReplicates: p,
                            ref: y,
                            isV40: b,
                            entity: S,
                            ...v
                        } = e,
                        j = (0, l.useMemo)(
                            () =>
                                s
                                    ? s.map((e, n) => {
                                          var a, r, l;
                                          let s = t.length > 0,
                                              i = t.some(
                                                  (n) =>
                                                      n.gene_quantification_files[0].accession ===
                                                      e.gene_quantification_files[0].accession
                                              );
                                          return {
                                              category: e.tissue,
                                              label: ((e, n, t, a) => {
                                                  let r = n.replaceAll("_", " ");
                                                  return (
                                                      r.length > 20 && (r = r.slice(0, 20) + "..."),
                                                      (r = (0, u.Zr)(r)),
                                                      ""
                                                          .concat(e.toFixed(2), ", ")
                                                          .concat(r, " (")
                                                          .concat(t)
                                                          .concat(a ? ", rep. " + a : "", ")")
                                                  );
                                              })(
                                                  null == (a = e.gene_quantification_files[0].quantifications[0])
                                                      ? void 0
                                                      : a.tpm,
                                                  e.biosample,
                                                  e.accession
                                              ),
                                              value:
                                                  null == (r = e.gene_quantification_files[0].quantifications[0])
                                                      ? void 0
                                                      : r.tpm,
                                              color:
                                                  (s && i) || !s
                                                      ? null != (l = f.Me[e.tissue])
                                                          ? l
                                                          : f.Me.missing
                                                      : "#CCCCCC",
                                              id: n.toString(),
                                              metadata: e,
                                          };
                                      })
                                    : [],
                            [s, t]
                        ),
                        R = (0, l.useCallback)(
                            (e) =>
                                (0, a.jsxs)(g.default, {
                                    maxWidth: 350,
                                    children: [
                                        (0, a.jsxs)(x.default, {
                                            variant: "body2",
                                            children: [
                                                (0, a.jsx)("b", { children: "Sample:" }),
                                                " ",
                                                (0, u.Zr)(e.metadata.biosample),
                                            ],
                                        }),
                                        (0, a.jsxs)(x.default, {
                                            variant: "body2",
                                            children: [
                                                (0, a.jsx)("b", { children: "Tissue:" }),
                                                " ",
                                                (0, u.Zr)(e.metadata.tissue),
                                            ],
                                        }),
                                        (0, a.jsxs)(x.default, {
                                            variant: "body2",
                                            children: [
                                                (0, a.jsx)("b", { children: "Biosample Type:" }),
                                                " ",
                                                (0, u.Zr)(e.metadata.biosample_type),
                                            ],
                                        }),
                                        "linearTPM" === n
                                            ? (0, a.jsxs)(x.default, {
                                                  variant: "body2",
                                                  children: [
                                                      (0, a.jsx)("b", { children: "TPM:" }),
                                                      " ",
                                                      e.value.toFixed(2),
                                                  ],
                                              })
                                            : (0, a.jsxs)(x.default, {
                                                  variant: "body2",
                                                  children: [
                                                      (0, a.jsxs)("b", {
                                                          children: [
                                                              "Log",
                                                              (0, a.jsx)("sub", { children: "10" }),
                                                              "(TPM + 1):",
                                                          ],
                                                      }),
                                                      " ",
                                                      e.value.toFixed(2),
                                                  ],
                                              }),
                                    ],
                                }),
                            [n]
                        );
                    return (0, a.jsxs)(g.default, {
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                        padding: 1,
                        sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" },
                        children: [
                            (0, a.jsx)(E, {
                                assembly: S.assembly,
                                RNAtype: i,
                                scale: n,
                                viewBy: c,
                                replicates: m,
                                setRNAType: o,
                                setViewBy: d,
                                setScale: h,
                                setReplicates: p,
                                disabled: b,
                            }),
                            b
                                ? (0, a.jsx)(x.default, {
                                      children: "No Gene expression data available on GENCODE V40 genes",
                                  })
                                : (0, a.jsx)(C.bH, {
                                      ...v,
                                      onBarClicked: (e) => {
                                          t.some((n) => n.accession === e.metadata.accession)
                                              ? r(t.filter((n) => n.accession !== e.metadata.accession))
                                              : r([...t, e.metadata]);
                                      },
                                      data: j,
                                      topAxisLabel:
                                          "linearTPM" === n
                                              ? "".concat(S.entityID, " Expression - TPM")
                                              : "".concat(S.entityID, " Expression - log₁₀(TPM + 1)"),
                                      TooltipContents: R,
                                      ref: y,
                                      downloadFileName: "".concat(S.entityID, "_expression_bar_plot"),
                                  }),
                        ],
                    });
                };
            var A = t(40650),
                w = t(78224);
            let T = {
                    ENCSR000AEC: [7.0538435, 3.5883412],
                    ENCSR000AEL: [7.2434087, 3.0979836],
                    ENCSR001HHK: [7.5635915, 5.2078276],
                    ENCSR003BTD: [8.536984, -0.625592],
                    ENCSR010HIU: [-2.0150244, 3.3086367],
                    ENCSR011VQI: [8.177839, 7.956738],
                    ENCSR015PUN: [2.8452575, 0.29001185],
                    ENCSR019ICB: [-11.767605, -7.4081416],
                    ENCSR023ZXN: [6.564914, -0.64021814],
                    ENCSR025BZY: [-11.465987, -6.053026],
                    ENCSR029KNZ: [6.815536, -0.49055907],
                    ENCSR033XWU: [8.560192, 8.09191],
                    ENCSR034DEZ: [12.147648, 2.930563],
                    ENCSR035SKV: [6.3587847, -0.19529411],
                    ENCSR042GYH: [5.7787666, -2.3675895],
                    ENCSR045GTF: [9.841066, -1.2830685],
                    ENCSR052FJA: [6.925164, 1.233572],
                    ENCSR052LON: [-11.500969, -7.1733794],
                    ENCSR061HMO: [-12.275541, -6.44859],
                    ENCSR071DYD: [7.8751087, -1.5406286],
                    ENCSR071ZLM: [4.365014, -3.4109323],
                    ENCSR073XFZ: [7.653986, 6.01162],
                    ENCSR074FTH: [9.121662, -1.5480005],
                    ENCSR075ZTG: [6.858532, -2.084676],
                    ENCSR077EAM: [7.8255544, 8.167571],
                    ENCSR078WNY: [-11.3871565, -6.320318],
                    ENCSR080HPT: [5.5425096, -2.1608992],
                    ENCSR094GVZ: [4.6217537, -2.2474346],
                    ENCSR094RQC: [12.360906, 3.4386804],
                    ENCSR094VRQ: [5.163666, -2.4211807],
                    ENCSR096LTX: [8.939838, -1.2845776],
                    ENCSR096UGR: [12.109126, 2.67525],
                    ENCSR098BUF: [5.5682383, -0.6679444],
                    ENCSR106SZN: [6.2659316, -1.6068037],
                    ENCSR108MAU: [5.8817635, 0.31699422],
                    ENCSR111PSY: [7.997747, 6.4729285],
                    ENCSR113CCF: [12.541348, 3.230376],
                    ENCSR113HQM: [4.2674446, -3.493138],
                    ENCSR128CYL: [10.807393, 2.4426594],
                    ENCSR129VBC: [9.633819, 1.8261425],
                    ENCSR130TZW: [8.17523, -0.7445345],
                    ENCSR131FDP: [2.0135467, -0.14321902],
                    ENCSR132VGJ: [2.6070478, 0.5011786],
                    ENCSR135IAL: [8.215265, -2.2640893],
                    ENCSR136WGP: [8.355414, 2.4977694],
                    ENCSR140DCD: [9.292643, -0.013496951],
                    ENCSR146GSS: [12.044763, 3.11009],
                    ENCSR146LBD: [4.8394613, -3.149998],
                    ENCSR146ZLV: [8.970761, 0.0609566],
                    ENCSR146ZSP: [9.1725855, 1.7042704],
                    ENCSR151FXS: [7.9688826, 7.9763975],
                    ENCSR151NGC: [7.8801756, 6.1357374],
                    ENCSR158KFO: [5.5737424, -1.5075214],
                    ENCSR164OCT: [7.5542946, 2.7595887],
                    ENCSR165QTZ: [7.2394214, -1.6323341],
                    ENCSR168PXI: [9.806856, 2.0305998],
                    ENCSR177CWW: [7.349268, 6.379219],
                    ENCSR177XCG: [9.001306, 7.325856],
                    ENCSR182CBU: [4.654755, -2.3089728],
                    ENCSR184LTL: [10.677212, -0.3029587],
                    ENCSR185TQB: [9.171347, -0.8169265],
                    ENCSR194HVU: [6.7649527, -1.2255802],
                    ENCSR196KBV: [8.273033, 7.704864],
                    ENCSR197GCF: [1.7558498, -0.34457478],
                    ENCSR198QAJ: [-11.221412, -7.0830045],
                    ENCSR201XOZ: [8.316456, -0.37368205],
                    ENCSR202OWR: [11.115921, -0.54093206],
                    ENCSR226KML: [6.176771, -2.4663515],
                    ENCSR229LFK: [8.030375, -2.0872636],
                    ENCSR231ICM: [9.380946, -0.33111015],
                    ENCSR233IJT: [7.5551543, 1.5973641],
                    ENCSR235PLU: [8.515653, 8.107456],
                    ENCSR238ZZD: [5.758857, -1.6720849],
                    ENCSR241EBI: [7.4299145, 6.528669],
                    ENCSR244HHV: [-1.7255745, 2.6513073],
                    ENCSR244ISQ: [8.723407, 2.6159632],
                    ENCSR245ATJ: [10.955131, 2.1210928],
                    ENCSR252UHW: [2.5065746, 0.41521984],
                    ENCSR254JJM: [7.398924, 2.2501423],
                    ENCSR257FJF: [11.663797, 2.9949534],
                    ENCSR257NIR: [6.002617, -3.402285],
                    ENCSR258ELN: [8.920045, -1.4584605],
                    ENCSR266PVZ: [2.6404917, 0.15511091],
                    ENCSR266SBI: [12.783479, 3.133681],
                    ENCSR267FRL: [12.681681, 3.1687145],
                    ENCSR272UNO: [4.7308955, -2.6225452],
                    ENCSR275SNI: [11.860574, 2.942499],
                    ENCSR276MMH: [6.064943, -1.1621052],
                    ENCSR276QGJ: [8.365977, 8.441933],
                    ENCSR278TQR: [1.7998929, -0.36762425],
                    ENCSR288RRZ: [-1.7906365, 3.265288],
                    ENCSR290IHM: [-12.151305, -6.61523],
                    ENCSR291TRJ: [9.910222, 2.7996695],
                    ENCSR294AKN: [12.827695, 2.8946857],
                    ENCSR296PMS: [4.8099236, -4.0173573],
                    ENCSR297AZN: [8.705117, 7.5235443],
                    ENCSR306IAW: [8.452899, 7.4550753],
                    ENCSR308XAR: [-1.7125726, 3.040919],
                    ENCSR313COD: [6.041136, -2.313764],
                    ENCSR314LXG: [7.37259, 4.102481],
                    ENCSR317HKT: [7.5661125, 6.9593277],
                    ENCSR320BRR: [4.9879103, -1.3783139],
                    ENCSR320OTJ: [9.167353, 0.016225932],
                    ENCSR321PGV: [6.0589743, 0.7373994],
                    ENCSR323GUF: [8.050405, -2.180517],
                    ENCSR330UMQ: [7.4592376, -1.1778879],
                    ENCSR332DBS: [6.5430226, 1.6206915],
                    ENCSR336VTK: [8.590032, 7.389704],
                    ENCSR343XXH: [9.99713, -0.7218956],
                    ENCSR344MQK: [6.3539243, -0.43508115],
                    ENCSR351OTL: [6.3004403, 0.4981856],
                    ENCSR352JCY: [10.112635, 2.0323443],
                    ENCSR354QPN: [5.02208, -2.8804724],
                    ENCSR355JZC: [10.9021435, 2.8193266],
                    ENCSR357BYU: [7.800452, -2.4335594],
                    ENCSR365ARV: [-11.91061, -6.8372684],
                    ENCSR368HRJ: [9.06544, -0.18541712],
                    ENCSR377FPC: [8.78958, -0.7604467],
                    ENCSR377MTB: [-11.501859, -6.3759217],
                    ENCSR379DEC: [9.537299, 3.2877724],
                    ENCSR379YAE: [7.7450457, 1.6453158],
                    ENCSR381OTM: [8.727327, 1.4718952],
                    ENCSR391VGU: [4.4271097, -0.531003],
                    ENCSR394HJK: [-11.330784, -6.1412425],
                    ENCSR394ZSF: [-11.843964, -6.7268414],
                    ENCSR395DKP: [-11.901711, -7.234435],
                    ENCSR398REC: [8.16076, 7.0967407],
                    ENCSR403SZN: [5.5910125, -3.5956063],
                    ENCSR406SAW: [6.0522175, -1.756093],
                    ENCSR410MSS: [9.916585, -1.3880525],
                    ENCSR411MUF: [7.91044, 8.183131],
                    ENCSR413QAL: [9.687148, 1.3770605],
                    ENCSR420NLC: [7.9676766, 2.5494232],
                    ENCSR420YFF: [-2.0985477, 3.1213815],
                    ENCSR420ZKB: [8.751817, 1.2151241],
                    ENCSR425RGZ: [6.077505, -2.1010208],
                    ENCSR429EGC: [9.627196, 2.2858262],
                    ENCSR429EWK: [5.8695555, -1.1021035],
                    ENCSR432EBE: [6.6642723, -2.2189202],
                    ENCSR434TEU: [4.7618313, -3.5598505],
                    ENCSR436QDU: [3.839654, -0.13202854],
                    ENCSR438YPF: [5.667658, -2.0719516],
                    ENCSR441IDG: [1.7817589, -0.13830711],
                    ENCSR444WHQ: [4.9539566, -0.9937823],
                    ENCSR446LDS: [7.903809, 6.4873395],
                    ENCSR447WLU: [-11.49083, -7.0602126],
                    ENCSR448BTT: [10.168266, -1.4686668],
                    ENCSR450BNZ: [4.808378, -4.363105],
                    ENCSR450ENK: [5.7731166, -0.0721151],
                    ENCSR450EXF: [9.732197, 2.8717544],
                    ENCSR457ENP: [3.883913, -0.026793513],
                    ENCSR460YCS: [5.932709, 0.6706915],
                    ENCSR464VSR: [-2.2024505, 3.2550619],
                    ENCSR469WPG: [10.841221, 2.623959],
                    ENCSR471RUK: [5.853635, -2.8179276],
                    ENCSR473XAP: [8.850478, 7.139642],
                    ENCSR474TRG: [6.0649295, 0.18319091],
                    ENCSR479MNN: [-1.9994755, 2.810411],
                    ENCSR480SLD: [5.4823904, 0.5529071],
                    ENCSR484WZL: [-1.8367231, 2.8371837],
                    ENCSR485WBR: [4.912621, -1.9447553],
                    ENCSR490SQH: [8.252721, 2.4010541],
                    ENCSR495HDM: [6.5670066, -0.08366852],
                    ENCSR500JSJ: [9.658268, -1.4646599],
                    ENCSR501DTN: [8.017824, 7.9546866],
                    ENCSR502PAY: [12.382737, 3.3204858],
                    ENCSR504NIU: [5.486849, -2.327982],
                    ENCSR504QMK: [6.639297, -2.3303564],
                    ENCSR510MIA: [6.016986, 0.106808096],
                    ENCSR516BJM: [10.863671, -0.08075293],
                    ENCSR516TTH: [2.5876799, 0.6486842],
                    ENCSR523RGW: [7.3743596, -1.9025486],
                    ENCSR528ZKN: [4.8912334, -1.9116577],
                    ENCSR532LJV: [7.4561663, -0.107599966],
                    ENCSR534OAS: [7.8132353, -2.4030042],
                    ENCSR535VTR: [7.6681695, 2.6924317],
                    ENCSR544SAU: [6.245377, -3.1638744],
                    ENCSR551NII: [5.700075, 0.72944677],
                    ENCSR558SEE: [10.255052, 2.8512976],
                    ENCSR559HWG: [9.657598, 2.6253893],
                    ENCSR562BUN: [-11.690495, -7.4695573],
                    ENCSR563SJY: [-11.662451, -7.081285],
                    ENCSR563VMC: [2.8810923, -0.6897249],
                    ENCSR568UGZ: [10.063475, -1.872827],
                    ENCSR568YRP: [8.273658, 2.504039],
                    ENCSR570DQR: [1.6445297, -0.47242004],
                    ENCSR571RXE: [4.3504143, -0.1622515],
                    ENCSR579BDN: [7.292168, -1.6019479],
                    ENCSR579KTN: [-12.014569, -6.225673],
                    ENCSR580GSX: [7.7973304, 2.2629209],
                    ENCSR584CVV: [7.9743485, 7.849309],
                    ENCSR584JXD: [7.1399536, 2.514126],
                    ENCSR585EUI: [-11.164172, -6.3428845],
                    ENCSR586SYA: [4.698507, -3.9029353],
                    ENCSR588EJX: [10.048605, 3.1474211],
                    ENCSR589EBT: [10.146398, -1.7336696],
                    ENCSR609NZM: [3.7777543, -0.5885066],
                    ENCSR615EEK: [11.395567, 3.482494],
                    ENCSR619DQO: [9.769255, -0.6778649],
                    ENCSR620LQN: [5.737968, -0.54060185],
                    ENCSR621PZI: [8.8390665, -1.7484418],
                    ENCSR622PIH: [3.0334384, 0.001611451],
                    ENCSR629HFE: [2.8781803, -0.67085487],
                    ENCSR630VJN: [6.0168805, -3.0303385],
                    ENCSR631FXT: [8.451204, 7.127596],
                    ENCSR631NUQ: [8.863914, -0.8033967],
                    ENCSR636LEU: [8.930142, 1.215025],
                    ENCSR645TCG: [5.6405616, -1.1105435],
                    ENCSR648KDM: [10.148294, 1.9746132],
                    ENCSR648OSR: [5.1493883, -2.9629588],
                    ENCSR648YUM: [-2.25456, 2.8513315],
                    ENCSR652PHZ: [3.1418488, 0.2159562],
                    ENCSR653DFZ: [7.037522, 2.5719483],
                    ENCSR653ZJF: [5.5168433, -3.973684],
                    ENCSR669KQU: [7.555772, 2.8099246],
                    ENCSR671IYC: [5.0397754, -3.9014182],
                    ENCSR673UKZ: [10.093591, 3.1854963],
                    ENCSR674KHG: [10.394542, -0.46468157],
                    ENCSR676SRP: [9.200856, -0.3141443],
                    ENCSR678TMV: [3.5040915, -0.56991404],
                    ENCSR681ARR: [11.071645, -0.41348326],
                    ENCSR687HJY: [6.2641635, -1.3877276],
                    ENCSR692DIM: [8.887477, 7.2585545],
                    ENCSR696SMK: [7.667491, 1.9914559],
                    ENCSR698RPL: [11.50212, 2.643546],
                    ENCSR701TST: [6.7295675, 0.1810217],
                    ENCSR712BRU: [9.445807, 2.985309],
                    ENCSR712GOC: [9.690983, 3.4600768],
                    ENCSR714CHF: [12.488832, 3.1033034],
                    ENCSR718RTN: [10.257753, -1.6249295],
                    ENCSR719PXC: [5.587158, -1.8367561],
                    ENCSR727DPU: [2.1820352, -0.009646819],
                    ENCSR729CAZ: [5.4140077, -1.9845775],
                    ENCSR729VMM: [12.385179, 3.4092603],
                    ENCSR733JBX: [9.975244, 2.4323635],
                    ENCSR735JKB: [8.776998, 1.3965212],
                    ENCSR740YMS: [7.090727, -0.063033134],
                    ENCSR743GKS: [11.231422, 2.7346687],
                    ENCSR745APD: [7.438831, 6.86987],
                    ENCSR750ETS: [4.4550376, -3.792584],
                    ENCSR752UNJ: [4.889203, -4.1638155],
                    ENCSR754WLW: [5.540268, -1.8624179],
                    ENCSR755FNG: [-11.094708, -6.3368707],
                    ENCSR759TPN: [11.206422, -0.20924611],
                    ENCSR761SHI: [9.723867, 2.547921],
                    ENCSR763OMY: [8.299022, -0.8019299],
                    ENCSR773COB: [10.901516, -0.600126],
                    ENCSR774MGO: [9.61484, 1.1592548],
                    ENCSR790BBE: [2.427818, -0.30538908],
                    ENCSR792OIJ: [11.107537, 3.4235542],
                    ENCSR796HLX: [4.950895, -2.6758232],
                    ENCSR797BPP: [4.88777, -1.5716604],
                    ENCSR797RXV: [9.195395, 1.4407525],
                    ENCSR800KLD: [12.768524, 2.9480062],
                    ENCSR800WIY: [5.816618, -3.303973],
                    ENCSR801MKV: [6.31298, -0.8474971],
                    ENCSR802HPM: [6.175506, -2.8244395],
                    ENCSR812AKX: [4.4253736, -3.8492055],
                    ENCSR815NTL: [11.193364, 2.4702787],
                    ENCSR816HLU: [9.966423, -1.6091676],
                    ENCSR816IZA: [9.777378, -1.8594807],
                    ENCSR818DBU: [2.5986953, -0.007462032],
                    ENCSR820PHH: [7.801479, 6.0451455],
                    ENCSR825UXP: [9.970183, -1.8932016],
                    ENCSR826FNO: [-11.173311, -6.521926],
                    ENCSR827IXS: [4.3090696, -3.269813],
                    ENCSR828JSJ: [1.3167975, -0.031960864],
                    ENCSR828TEI: [5.0803304, -0.9592427],
                    ENCSR831GLL: [8.330165, 8.2931795],
                    ENCSR837VMK: [2.235788, 0.6013452],
                    ENCSR837ZLY: [5.274548, -1.5751868],
                    ENCSR838XNO: [8.701024, -0.9600241],
                    ENCSR839ZDH: [5.1098685, -4.17799],
                    ENCSR841ADZ: [5.35447, -2.6585133],
                    ENCSR841QAC: [8.951117, 1.4197899],
                    ENCSR842NDO: [7.925948, 6.8441825],
                    ENCSR853BNH: [4.0894423, -0.7787056],
                    ENCSR853TXT: [2.9304159, -0.15165965],
                    ENCSR853WOM: [5.263979, -3.7491],
                    ENCSR854VRX: [1.6309518, -0.42747778],
                    ENCSR857WJK: [4.8607655, -2.018761],
                    ENCSR858QEL: [4.824723, -3.0714936],
                    ENCSR862RGX: [5.6987705, 0.9462535],
                    ENCSR863EIY: [-11.513426, -6.9213443],
                    ENCSR863VFU: [-12.196092, -6.3133507],
                    ENCSR870IUI: [2.6509807, -0.85479057],
                    ENCSR876TAN: [2.7133484, 0.6675517],
                    ENCSR880EGO: [7.4971457, 2.172854],
                    ENCSR882HXI: [-11.33139, -7.27597],
                    ENCSR882RCG: [1.4994183, -0.1950878],
                    ENCSR889IAP: [1.969651, 0.22831179],
                    ENCSR892LBU: [9.539965, -0.9519871],
                    ENCSR894WMQ: [6.740954, 1.3096038],
                    ENCSR895ZTB: [9.762066, 3.0812047],
                    ENCSR896YYL: [8.396186, 7.591503],
                    ENCSR897JEH: [11.531925, 2.2143717],
                    ENCSR899OKE: [-1.695999, 3.3632755],
                    ENCSR900FUP: [2.3980806, 0.38717073],
                    ENCSR900SGE: [6.6357665, -1.4677396],
                    ENCSR903XMI: [-2.3622441, 3.4399915],
                    ENCSR908ZAS: [7.285705, 0.8074529],
                    ENCSR911XSA: [9.049525, 7.734096],
                    ENCSR915EBZ: [2.4661543, -0.18061288],
                    ENCSR919QJT: [7.448117, 2.0258994],
                    ENCSR924MSZ: [2.7156696, 0.13094726],
                    ENCSR925DZW: [7.7339263, 6.858833],
                    ENCSR927KSI: [8.188154, 8.18847],
                    ENCSR931ATS: [11.790331, 3.2708747],
                    ENCSR938LSP: [8.605068, 2.9344382],
                    ENCSR942YMN: [-1.9392909, 3.0187395],
                    ENCSR944UJZ: [-11.508676, -6.8423195],
                    ENCSR945VLG: [12.245799, 2.7235696],
                    ENCSR954PZB: [7.376443, -0.40914732],
                    ENCSR956ZVR: [9.046736, 7.504559],
                    ENCSR964JRR: [7.2982874, 6.9201937],
                    ENCSR967JPI: [3.4607804, -0.7897779],
                    ENCSR968WKR: [6.7617545, 2.1015778],
                    ENCSR971GPJ: [8.039665, 2.9587],
                    ENCSR971KNW: [7.1500654, 2.2240975],
                    ENCSR985WSV: [-12.020435, -6.5921087],
                    ENCSR989IFF: [8.092693, 6.648864],
                    ENCSR991HIR: [5.6133547, 0.48824808],
                    ENCSR995GRL: [7.43006, 6.650281],
                    ENCSR997KDB: [2.727163, 0.42957112],
                },
                k = {
                    ENCSR000AJV: [1.4659382, 4.059622],
                    ENCSR004XCU: [5.3141823, 15.6872635],
                    ENCSR017JEG: [5.491884, 16.191376],
                    ENCSR020DGG: [2.5773466, 2.239127],
                    ENCSR039ADS: [6.0912, 2.6134548],
                    ENCSR049UJU: [1.6527557, 2.494371],
                    ENCSR062VTB: [6.4522047, 2.3291178],
                    ENCSR080EVZ: [5.425637, 14.072421],
                    ENCSR095VGF: [1.5713793, 0.14385188],
                    ENCSR096STK: [0.3825104, 4.1371107],
                    ENCSR115TWD: [5.467078, 14.895548],
                    ENCSR150CUE: [2.0623043, 2.1003883],
                    ENCSR160IIN: [8.245171, 10.862248],
                    ENCSR173PJN: [6.0048256, 1.889988],
                    ENCSR178GUS: [6.091744, 1.0414625],
                    ENCSR185LWM: [5.2285037, 13.71995],
                    ENCSR216NEG: [7.0105352, 7.0273066],
                    ENCSR284AMY: [1.2635208, 3.54551],
                    ENCSR284YKY: [2.0484176, 1.8771112],
                    ENCSR285WZV: [5.561669, 15.389391],
                    ENCSR304RDL: [8.40333, 9.943014],
                    ENCSR307BCA: [8.819528, 10.8579235],
                    ENCSR331XCE: [6.3409033, 0.5661572],
                    ENCSR337FYI: [9.051891, 11.330691],
                    ENCSR343YLB: [4.8127775, 14.998443],
                    ENCSR347SQR: [7.6577125, 7.854954],
                    ENCSR362AIZ: [5.877923, 16.216751],
                    ENCSR367ZPZ: [5.7273774, 15.1671505],
                    ENCSR370SFB: [6.3723016, 1.1904726],
                    ENCSR401BSG: [5.118991, 15.38078],
                    ENCSR420QTO: [8.412574, 11.521383],
                    ENCSR438XCG: [2.3008904, 3.2052176],
                    ENCSR442XRH: [1.3248371, -0.08694898],
                    ENCSR448MXQ: [1.0023811, 4.0177717],
                    ENCSR457RRW: [5.654866, 2.641053],
                    ENCSR465PBJ: [1.8467009, 0.18085091],
                    ENCSR466KZY: [6.3239465, 1.2270167],
                    ENCSR508GWZ: [8.451202, 11.7102],
                    ENCSR526SEX: [2.1475918, 1.0906086],
                    ENCSR537GNQ: [6.253137, 2.103878],
                    ENCSR538WYL: [7.8946786, 7.673035],
                    ENCSR541XZK: [8.126024, 8.90121],
                    ENCSR557RMA: [5.074291, 14.929459],
                    ENCSR559TRB: [4.9422975, 15.658146],
                    ENCSR597UZW: [2.5192192, 1.5489451],
                    ENCSR611PTP: [0.5916159, 3.9373674],
                    ENCSR636CWO: [7.471399, 7.264494],
                    ENCSR647QBV: [7.787959, 11.398142],
                    ENCSR648YEP: [0.8760245, 4.3176045],
                    ENCSR691OPQ: [1.7600343, 2.2592175],
                    ENCSR712PLG: [5.2556267, 16.467373],
                    ENCSR719NAJ: [5.9069314, 16.056906],
                    ENCSR727FHP: [2.113924, 1.5917072],
                    ENCSR748DUR: [1.9274211, -0.13487399],
                    ENCSR750YSX: [8.02492, 8.3579855],
                    ENCSR752RGN: [5.5355177, 13.751212],
                    ENCSR760TOE: [9.022266, 10.831868],
                    ENCSR764OPZ: [8.491743, 10.3319845],
                    ENCSR792RJV: [5.788236, 14.080897],
                    ENCSR795WFC: [1.6057961, 0.38959485],
                    ENCSR809VYL: [8.454278, 9.497885],
                    ENCSR823VEE: [7.1373243, 7.415626],
                    ENCSR826HIQ: [0.24759197, 4.104016],
                    ENCSR830IVQ: [7.263488, 7.1747484],
                    ENCSR848GST: [6.695704, 0.99531657],
                    ENCSR848HOX: [8.029228, 9.379225],
                    ENCSR851HEC: [7.779126, 8.442153],
                    ENCSR867YNV: [0.49043396, 3.883255],
                    ENCSR906YQZ: [6.651926, 1.5037848],
                    ENCSR908JWT: [7.924929, 11.530146],
                    ENCSR921PRX: [5.581156, 14.727017],
                    ENCSR932TRU: [6.1604466, 1.5753882],
                    ENCSR943LKA: [8.934452, 10.292733],
                    ENCSR968QHO: [8.369105, 9.045782],
                    ENCSR970EWM: [6.009167, 13.51426],
                    ENCSR982MRY: [5.3458023, 2.1873639],
                    ENCSR992WBR: [5.5951915, 2.3119125],
                    ENCSR996TVY: [5.1665325, 16.542822],
                },
                _ = (0, w.J)(
                    "\nquery geneexpression($assembly: String!, $gene_id: [String]) {\n  gene_dataset(processed_assembly: $assembly) {\n    biosample\n    tissue\n  	cell_compartment\n    biosample_type\n  	assay_term_name\n    accession  \n    gene_quantification_files(assembly: $assembly) {\n      accession\n      biorep\n      quantifications(gene_id_prefix: $gene_id) {\n        tpm\n        file_accession\n      }\n    }\n  }\n}\n "
                );
            var I = t(78062),
                M = t(58552),
                F = t(18058);
            let G = (e) => {
                let {
                        scale: n,
                        setScale: t,
                        selected: r,
                        sortedFilteredData: s,
                        setSelected: i,
                        RNAtype: o,
                        setRNAType: c,
                        viewBy: d,
                        setViewBy: u,
                        replicates: h,
                        setReplicates: m,
                        ref: p,
                        rows: x,
                        entity: y,
                        geneExpressionData: b,
                        ...S
                    } = e,
                    [v, j] = (0, l.useState)("max"),
                    [R, N] = (0, l.useState)(!0),
                    { loading: A } = b,
                    w = (0, l.useMemo)(() => {
                        if (!x) return [];
                        let e = Object.entries(
                            x.reduce((e, n) => {
                                let t = n.tissue;
                                return e[t] || (e[t] = []), e[t].push(n), e;
                            }, {})
                        ).map((e) => {
                            var n;
                            let [t, a] = e,
                                l = a.map((e) => {
                                    var n;
                                    return null == (n = e.gene_quantification_files[0].quantifications[0])
                                        ? void 0
                                        : n.tpm;
                                }),
                                s =
                                    0 === r.length ||
                                    a.every((e) =>
                                        r.some(
                                            (n) =>
                                                n.gene_quantification_files[0].accession ===
                                                e.gene_quantification_files[0].accession
                                        )
                                    )
                                        ? null != (n = f.Me[t])
                                            ? n
                                            : f.Me.missing
                                        : "#CCCCCC";
                            return {
                                label: t,
                                data: l.map((e, n) => {
                                    var s;
                                    let i = a[n],
                                        o =
                                            0 === r.length ||
                                            r.some(
                                                (e) =>
                                                    e.gene_quantification_files[0].accession ===
                                                    i.gene_quantification_files[0].accession
                                            ),
                                        c = o ? (null != (s = f.Me[t]) ? s : f.Me.missing) : "#CCCCCC",
                                        d = o ? 4 : 2;
                                    return l.length < 3
                                        ? { value: e, radius: d, tissue: t, metadata: i, color: c }
                                        : {
                                              value: e,
                                              radius: 0 === r.length ? 2 : d,
                                              tissue: t,
                                              metadata: i,
                                              color: c,
                                          };
                                }),
                                violinColor: s,
                            };
                        });
                        return (
                            e.sort((e, n) => {
                                if ("tissue" === v) return e.label.localeCompare(n.label);
                                if ("median" === v) {
                                    let t = (e) => {
                                        let n = [...e].sort((e, n) => e - n),
                                            t = Math.floor(n.length / 2);
                                        return n.length % 2 != 0 ? n[t] : (n[t - 1] + n[t]) / 2;
                                    };
                                    return t(n.data.map((e) => e.value)) - t(e.data.map((e) => e.value));
                                }
                                return "max" === v
                                    ? Math.max(...n.data.map((e) => e.value)) - Math.max(...e.data.map((e) => e.value))
                                    : 0;
                            }),
                            e
                        );
                    }, [r, x, v]);
                return (0, a.jsxs)(g.default, {
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    padding: 1,
                    sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" },
                    children: [
                        (0, a.jsx)(E, {
                            assembly: y.assembly,
                            RNAtype: o,
                            scale: n,
                            viewBy: d,
                            replicates: h,
                            setRNAType: c,
                            setViewBy: u,
                            setScale: t,
                            setReplicates: m,
                            violin: !0,
                            sortBy: v,
                            setSortBy: j,
                            showPoints: R,
                            setShowPoints: N,
                        }),
                        (0, a.jsx)(g.default, {
                            width: "100%",
                            height: "calc(100% - 63px)",
                            children: (0, a.jsx)(C.Dq, {
                                ...S,
                                onPointClicked: (e) => {
                                    let n = e.metadata.accession;
                                    r.some((e) => e.accession === n)
                                        ? i(r.filter((e) => e.accession !== n))
                                        : i([...r, e.metadata]);
                                },
                                onViolinClicked: (e) => {
                                    let n = e.data.map((e) => e.metadata);
                                    if (n.every((e) => r.some((n) => n.accession === e.accession)))
                                        i(r.filter((e) => !n.some((n) => n.accession === e.accession)));
                                    else {
                                        let e = n.filter((e) => !r.some((n) => n.accession === e.accession));
                                        i([...r, ...e]);
                                    }
                                },
                                distributions: w,
                                axisLabel:
                                    "linearTPM" === n
                                        ? "".concat(y.entityID, " Expression - TPM")
                                        : "".concat(y.entityID, " Expression - Log₁₀(TPM + 1)"),
                                loading: A,
                                labelOrientation: "leftDiagonal",
                                violinProps: { bandwidth: "scott", showAllPoints: R, jitter: 10 },
                                crossProps: { outliers: R ? "all" : "none" },
                                ref: p,
                                downloadFileName: "".concat(y.entityID, "_expression_violin_plot"),
                                pointTooltipBody: (e) => {
                                    var t, r, l, s, i, o;
                                    let c =
                                            null !=
                                            (o =
                                                null == (r = e.metadata) ||
                                                null == (t = r.gene_quantification_files[0].quantifications[0])
                                                    ? void 0
                                                    : t.tpm)
                                                ? o
                                                : 0,
                                        d = "linearTPM" === n ? c : Math.log10(c + 1);
                                    return (0, a.jsxs)(g.default, {
                                        maxWidth: 300,
                                        children: [
                                            e.outlier &&
                                                (0, a.jsx)("div", {
                                                    children: (0, a.jsx)("strong", { children: "Outlier" }),
                                                }),
                                            (0, a.jsxs)("div", {
                                                children: [
                                                    (0, a.jsx)("strong", { children: "Accession:" }),
                                                    " ",
                                                    null == (l = e.metadata) ? void 0 : l.accession,
                                                ],
                                            }),
                                            (0, a.jsxs)("div", {
                                                children: [
                                                    (0, a.jsx)("strong", { children: "Biosample:" }),
                                                    " ",
                                                    null == (s = e.metadata) ? void 0 : s.biosample,
                                                ],
                                            }),
                                            (0, a.jsxs)("div", {
                                                children: [
                                                    (0, a.jsx)("strong", { children: "Tissue:" }),
                                                    " ",
                                                    null == (i = e.metadata) ? void 0 : i.tissue,
                                                ],
                                            }),
                                            (0, a.jsxs)("div", {
                                                children: [
                                                    (0, a.jsxs)("strong", {
                                                        children: ["linearTPM" === n ? "TPM" : "Log₁₀(TPM + 1)", ":"],
                                                    }),
                                                    " ",
                                                    d.toFixed(2),
                                                ],
                                            }),
                                        ],
                                    });
                                },
                            }),
                        }),
                    ],
                });
            };
            var P = t(76151);
            let D = (e) => {
                let { gene: n } = e;
                return (0, a.jsxs)(y.default, {
                    direction: "row",
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    p: 2,
                    spacing: 1,
                    children: [
                        (0, a.jsx)(P.A, {}),
                        (0, a.jsxs)(x.default, {
                            children: [
                                (0, a.jsx)("i", { children: n }),
                                " is annotated in GENCODE Version 40, but gene expression data is currently only available for GENCODE Version 29",
                            ],
                        }),
                    ],
                });
            };
            var H = t(52403);
            let B = (e) => {
                var n;
                let { entity: t } = e,
                    s = (0, H.V)({ name: t.entityID, assembly: t.assembly }),
                    [i, o] = (0, l.useState)([]),
                    [c, d] = (0, l.useState)([]),
                    [u, h] = (0, l.useState)("linearTPM"),
                    [g, x] = (0, l.useState)("mean"),
                    [f, C] = (0, l.useState)("byExperimentTPM"),
                    [y, b] = (0, l.useState)("GRCh38" === t.assembly ? "total RNA-seq" : "all"),
                    S = (e) => {
                        o([]), x(e);
                    },
                    v = (0, l.useRef)(null),
                    j = (0, l.useRef)(null),
                    R = (0, l.useRef)(null),
                    E = ((e) => {
                        let { id: n, assembly: t, skip: a } = e,
                            {
                                data: r,
                                loading: s,
                                error: i,
                            } = (0, A.IT)(_, {
                                variables: { gene_id: null == n ? void 0 : n.split(".")[0], assembly: t },
                                skip: a || !n,
                            }),
                            o = (0, l.useMemo)(() => {
                                if (r)
                                    return {
                                        ...r,
                                        gene_dataset: r.gene_dataset.map((e) => ({
                                            ...e,
                                            biosample: e.biosample.replaceAll('"', ""),
                                            biosampleid: e.biosample_type.replaceAll('"', ""),
                                            umap_1: "mm10" === t ? k[e.accession][0] : T[e.accession][0],
                                            umap_2: "mm10" === t ? k[e.accession][1] : T[e.accession][1],
                                        })),
                                    };
                            }, [t, r]);
                        return { data: null == o ? void 0 : o.gene_dataset, loading: s, error: i };
                    })({ id: null == s || null == (n = s.data) ? void 0 : n.id, assembly: t.assembly, skip: !s }),
                    w = (0, l.useMemo)(() => {
                        var e, n, t, a, r, l;
                        let s =
                                null == E ||
                                null == (t = E.data) ||
                                null == (n = t[0]) ||
                                null == (e = n.gene_quantification_files)
                                    ? void 0
                                    : e[0],
                            i =
                                (null == s || null == (r = s.quantifications) || null == (a = r[0])
                                    ? void 0
                                    : a.tpm) !== void 0;
                        return !!(null == E || null == (l = E.data) ? void 0 : l.length) && !i;
                    }, [null == E ? void 0 : E.data]),
                    P = (0, l.useMemo)(() => {
                        var e;
                        return (null == E || null == (e = E.data) ? void 0 : e.length) && !w
                            ? E.data
                                  .filter((e) => "all" === y || e.assay_term_name === y)
                                  .flatMap((e) => {
                                      var n, t, a;
                                      let r =
                                          null !=
                                          (t = null == (n = e.gene_quantification_files) ? void 0 : n.filter(Boolean))
                                              ? t
                                              : [];
                                      if ("all" === g)
                                          return r.flatMap((n, t) => {
                                              var a, l;
                                              let s = (
                                                      null !=
                                                      (l = null == (a = n.quantifications) ? void 0 : a.filter(Boolean))
                                                          ? l
                                                          : []
                                                  )[0],
                                                  i = null == s ? void 0 : s.tpm,
                                                  o = "logTPM" === u ? Math.log10(i + 1) : i,
                                                  c = r.length > 1 ? " rep. ".concat(t + 1) : "",
                                                  d = "".concat(e.accession).concat(c);
                                              return {
                                                  ...e,
                                                  accession: d,
                                                  gene_quantification_files: [
                                                      { ...n, quantifications: [{ ...s, tpm: o }] },
                                                  ],
                                              };
                                          });
                                      {
                                          let n = r.flatMap((e) => {
                                              var n, t;
                                              return null !=
                                                  (t = null == (n = e.quantifications) ? void 0 : n.filter(Boolean))
                                                  ? t
                                                  : [];
                                          });
                                          if (!n.length) return [];
                                          let t = n.reduce((e, n) => e + (null == n ? void 0 : n.tpm), 0) / n.length,
                                              l = "logTPM" === u ? Math.log10(t + 1) : t;
                                          return [
                                              {
                                                  ...e,
                                                  gene_quantification_files: [
                                                      {
                                                          accession: null == (a = r[0]) ? void 0 : a.accession,
                                                          biorep: null,
                                                          quantifications: [{ file_accession: "average", tpm: l }],
                                                      },
                                                  ],
                                              },
                                          ];
                                      }
                                  })
                            : [];
                    }, [E.data, w, y, g, u]),
                    B = (0, l.useMemo)(
                        () => ({
                            rows: P,
                            selected: i,
                            setSelected: o,
                            sortedFilteredData: c,
                            setSortedFilteredData: d,
                            scale: u,
                            setScale: h,
                            replicates: g,
                            setReplicates: S,
                            viewBy: f,
                            setViewBy: C,
                            RNAtype: y,
                            setRNAType: b,
                            geneExpressionData: E,
                            entity: t,
                        }),
                        [P, i, c, u, g, f, y, E, t]
                    );
                return (0, a.jsxs)(a.Fragment, {
                    children: [
                        w && (0, a.jsx)(D, { gene: t.entityID }),
                        (0, a.jsx)(r.A, {
                            TableComponent: (0, a.jsx)(m, { ...B }),
                            plots: [
                                {
                                    tabTitle: "Bar Plot",
                                    icon: (0, a.jsx)(I.A, {}),
                                    plotComponent: (0, a.jsx)(N, { ref: v, ...B, isV40: w }),
                                    ref: v,
                                },
                                {
                                    tabTitle: "Violin Plot",
                                    icon: (0, a.jsx)(M.A, {}),
                                    plotComponent: (0, a.jsx)(G, { ref: j, ...B }),
                                    ref: j,
                                },
                                {
                                    tabTitle: "UMAP",
                                    icon: (0, a.jsx)(F.A, {}),
                                    plotComponent: (0, a.jsx)(p.A, { ref: R, ...B }),
                                    ref: R,
                                },
                            ],
                            isV40: w,
                        }),
                    ],
                });
            };
        },
        9325: (e, n, t) => {
            t.d(n, { A: () => l });
            var a = t(40650),
                r = t(81362);
            let l = function (e, n) {
                    let { loading: t, error: r, data: l } = (0, a.IT)(s, { variables: { icres: e, snps: n } });
                    return { data: null == l ? void 0 : l.immuneGWASLdrQuery, loading: t, error: r };
                },
                s = (0, r.J1)(
                    "\nquery getimmuneGWASLdr($icres: [String], $snps: [String]) {\n    immuneGWASLdrQuery(snps: $snps, icres: $icres) {\n      snp_chr\n      snp_end\n      snp_start\n      snpid\n      icre\n      ref_allele\n      author\n      effect_allele\n      zscore\n      study_source\n      disease\n      icre_chr\n      icre_start\n      icre_end\n      icre_class\n      study\n      study_link\n    }\n  }"
                );
        },
        9553: (e, n, t) => {
            t.d(n, { default: () => m });
            var a = t(95155),
                r = t(96869),
                l = t(9325),
                s = t(84185),
                i = t(12115),
                o = t(83982),
                c = t(51760);
            function d(e) {
                let { accession: n } = e,
                    { data: t, loading: r, error: d } = (0, l.A)([n]),
                    u = [...new Set(null == t ? void 0 : t.map((e) => e.snpid))],
                    { data: h, loading: m } = (0, s.B)(u),
                    p = (0, i.useMemo)(() => {
                        if (t && h)
                            return t.map((e) => {
                                var n, t;
                                let a = e.zscore;
                                return (
                                    e.effect_allele === (null == (n = h[e.snpid]) ? void 0 : n.alt) &&
                                        e.ref_allele === (null == (t = h[e.snpid]) ? void 0 : t.ref) &&
                                        (a = e.zscore < 0 ? e.zscore : -e.zscore),
                                    { ...e, zscore: a }
                                );
                            });
                    }, [t, h]),
                    g = [
                        {
                            field: "snpid",
                            headerName: "rsID",
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, { href: "/GRCh38/variant/" + e.value, children: e.value }),
                        },
                        { field: "snp_chr", headerName: "Chromosome", width: 100 },
                        { field: "snp_start", headerName: "Position", renderCell: (e) => e.value.toLocaleString() },
                        {
                            field: "zscore",
                            headerName: "Z-score",
                            type: "number",
                            valueFormatter: (e) => (null == e ? "" : "".concat(e.toFixed(2))),
                        },
                        {
                            field: "disease",
                            headerName: "Disease",
                            valueGetter: (e, n) => ("" === e ? n.study_source : e),
                        },
                        { field: "study_source", headerName: "Source" },
                        {
                            field: "study_link",
                            headerName: "Study",
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: e.value,
                                    showExternalIcon: !e.row.isiCRE,
                                    openInNewTab: !e.row.isiCRE,
                                    children: e.value,
                                }),
                        },
                        {
                            field: "author",
                            headerName: "Author",
                            renderCell: (e) =>
                                e.value ? "".concat(e.value.replace(/(\d+)$/, " $1")) : (0, a.jsx)(a.Fragment, {}),
                        },
                    ];
                return (0, a.jsx)(o.XIK, {
                    rows: p,
                    columns: g,
                    loading: r || m,
                    initialState: { sorting: { sortModel: [{ field: "zscore", sort: "desc" }] } },
                    label: "Immune GWAS Variants intersecting ".concat(n),
                    emptyTableFallback:
                        "This cCRE does not intersect any variants associated with significant changes in immune-related phenotypes",
                    divHeight: { maxHeight: "400px" },
                });
            }
            var u = t(58154),
                h = t(88343);
            let m = (e) => {
                let { entity: n } = e;
                return (0, a.jsxs)(r.default, {
                    spacing: 2,
                    children: [
                        (0, a.jsx)(h.default, { entity: n }),
                        "GRCh38" === n.assembly && (0, a.jsx)(d, { accession: n.entityID }),
                        "GRCh38" === n.assembly && (0, a.jsx)(u.default, { entity: n }),
                    ],
                });
            };
        },
        10152: (e, n, t) => {
            t.d(n, { Fc: () => i, PE: () => o, XY: () => s, an: () => l });
            var a = t(80494),
                r = t(94434);
            let l = "#D05F45",
                s = [
                    {
                        id: "default-dnase",
                        title: "Agregated DNase-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.dnase,
                        height: 50,
                        url: "https://downloads.wenglab.org/DNAse_All_ENCODE_MAR20_2024_merged.bw",
                    },
                    {
                        id: "default-h3k4me3",
                        title: "Aggregated H3K4me3 ChIP-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.h3k4me3,
                        height: 50,
                        url: "https://downloads.wenglab.org/H3K4me3_All_ENCODE_MAR20_2024_merged.bw",
                    },
                    {
                        id: "default-h3k27ac",
                        title: "Aggregated H3K27ac ChIP-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.h3k27ac,
                        height: 50,
                        url: "https://downloads.wenglab.org/H3K27ac_All_ENCODE_MAR20_2024_merged.bw",
                    },
                    {
                        id: "default-ctcf",
                        title: "Aggregated CTCF ChIP-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.ctcf,
                        height: 50,
                        url: "https://downloads.wenglab.org/CTCF_All_ENCODE_MAR20_2024_merged.bw",
                    },
                    {
                        id: "default-atac",
                        title: "Aggregated ATAC ChIP-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.atac,
                        height: 50,
                        url: "https://downloads.wenglab.org/ATAC_All_ENCODE_MAR20_2024_merged.bw",
                    },
                ],
                i = [
                    {
                        id: "default-dnase",
                        title: "Aggregated DNase-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.dnase,
                        height: 50,
                        url: "https://downloads.wenglab.org/DNase_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
                    },
                    {
                        id: "default-h3k4me3",
                        title: "Aggregated H3K4me3 ChIP-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.h3k4me3,
                        height: 50,
                        url: "https://downloads.wenglab.org/H3K4me3_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
                    },
                    {
                        id: "default-h3k27ac",
                        title: "Aggregated H3K27ac ChIP-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.h3k27ac,
                        height: 50,
                        url: "https://downloads.wenglab.org/H3K27ac_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
                    },
                    {
                        id: "default-ctcf",
                        title: "Aggregated CTCF ChIP-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.ctcf,
                        height: 50,
                        url: "https://downloads.wenglab.org/CTCF_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
                    },
                    {
                        id: "default-atac",
                        title: "Aggregated ATAC ChIP-seq signal, all Registry biosamples",
                        titleSize: 12,
                        trackType: a.S.BigWig,
                        displayMode: a.q5.Full,
                        color: r.R0.atac,
                        height: 50,
                        url: "https://downloads.wenglab.org/ATAC_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
                    },
                ],
                o = {
                    TssFlnk: { description: "Flanking TSS", stateno: "E1", color: "#FF4500" },
                    TssFlnkD: { description: "Flanking TSS downstream", stateno: "E2", color: "#FF4500" },
                    TssFlnkU: { description: "Flanking TSS upstream", stateno: "E3", color: "#FF4500" },
                    Tss: { description: "Active TSS", stateno: "E4", color: "#FF0000" },
                    Enh1: { description: "Enhancer", stateno: "E5", color: "#FFDF00" },
                    Enh2: { description: "Enhancer", stateno: "E6", color: "#FFDF00" },
                    EnhG1: { description: "Enhancer in gene", stateno: "E7", color: "#AADF07" },
                    EnhG2: { description: "Enhancer in gene", stateno: "E8", color: "#AADF07" },
                    TxWk: { description: "Weak transcription", stateno: "E9", color: "#3F9A50" },
                    Biv: { description: "Bivalent", stateno: "E10", color: "#CD5C5C" },
                    ReprPC: { description: "Repressed by Polycomb", stateno: "E11", color: "#8937DF" },
                    Quies: { description: "Quiescent", stateno: "E12", color: "#DCDCDC" },
                    Het: { description: "Heterochromatin", stateno: "E13", color: "#4B0082" },
                    "ZNF/Rpts": { description: "ZNF genes repreats", stateno: "E14", color: "#68cdaa" },
                    Tx: { description: "Transcription", stateno: "E15", color: "#008000" },
                };
        },
        16264: (e, n, t) => {
            t.d(n, { default: () => p });
            var a = t(95155),
                r = t(96869),
                l = t(81387),
                s = t(29726),
                i = t(38083),
                o = t(83982),
                c = t(51760),
                d = t(80207),
                u = t(40650);
            let h = (0, d.J1)(
                    "\n   query ccreSearchQuery_2(\n    $assembly: String!    \n    $accessions: [String!]\n  ) {\n    cCRESCREENSearch(\n      assembly: $assembly\n      accessions: $accessions      \n      nearbygeneslimit: 3\n    ) {\n      \n      nearestgenes {\n        gene        \n        distance\n      }\n    }\n  }\n"
                ),
                m = (0, d.J1)(
                    "   \nquery geneDataQuery($assembly: String!,$name: [String], $version: Int) {\n    gene(assembly: $assembly, name: $name, version: $version) {\n      name\n      id\n        gene_type\n      coordinates {\n        start\n        chromosome\n        end\n      }\n    }\n  }  \n \n"
                );
            function p(e) {
                let { entity: n } = e,
                    t = "GRCh38" === n.assembly,
                    { data: d, loading: p, error: g } = (0, l.A)([n.entityID], !t),
                    {
                        data: x,
                        loading: f,
                        error: C,
                    } = (function (e, n) {
                        let {
                                data: t,
                                loading: a,
                                error: r,
                            } = (0, u.IT)(h, { variables: { accessions: [e], assembly: n } }),
                            {
                                data: l,
                                loading: s,
                                error: i,
                            } = (0, u.IT)(m, {
                                variables: {
                                    name: t && t.cCRESCREENSearch[0].nearestgenes.map((e) => e.gene),
                                    version: "GRCh38" == n ? 40 : 25,
                                    assembly: n,
                                },
                                skip: a || !t || (t && 0 === t.cCRESCREENSearch.length),
                            });
                        return {
                            data:
                                t &&
                                t.cCRESCREENSearch[0].nearestgenes.map((e) => {
                                    let n;
                                    return (
                                        !l || i || s || (n = l.gene.find((n) => n.name === e.gene)),
                                        {
                                            name: e.gene,
                                            distance: e.distance,
                                            chromosome: n && n.coordinates.chromosome,
                                            start: n && n.coordinates.start,
                                            stop: n && n.coordinates.end,
                                            type:
                                                n && "lncRNA" === n.gene_type
                                                    ? n.gene_type
                                                    : n &&
                                                      n.gene_type
                                                          .replaceAll("_", " ")
                                                          .split(" ")
                                                          .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                                          .join(" "),
                                        }
                                    );
                                }),
                            loading: a,
                            error: r,
                        };
                    })(n.entityID, n.assembly),
                    y =
                        null == d
                            ? void 0
                            : d.filter((e) => "Intact-HiC" === e.assay).map((e, n) => ({ ...e, id: n.toString() })),
                    b =
                        null == d
                            ? void 0
                            : d
                                  .filter((e) => "RNAPII-ChIAPET" === e.assay || "CTCF-ChIAPET" === e.assay)
                                  .map((e, n) => ({ ...e, id: n.toString() })),
                    S =
                        null == d
                            ? void 0
                            : d.filter((e) => "CRISPR" === e.method).map((e, n) => ({ ...e, id: n.toString() })),
                    v =
                        null == d
                            ? void 0
                            : d.filter((e) => "eQTLs" === e.method).map((e, n) => ({ ...e, id: n.toString() })),
                    j = [
                        {
                            label: "Intact Hi-C Loops",
                            rows: y,
                            columns: s.gW,
                            sortColumn: "p_val",
                            sortDirection: "asc",
                            emptyTableFallback: "No intact Hi-C loops overlap this cCRE and the promoter of a gene",
                            loading: p,
                            error: !!g,
                        },
                        {
                            label: "ChIA-PET Interactions",
                            rows: b,
                            columns: s.gI,
                            sortColumn: "score",
                            sortDirection: "desc",
                            emptyTableFallback: "No ChIA-PET interactions overlap this cCRE and the promoter of a gene",
                            loading: p,
                            error: !!g,
                        },
                        {
                            label: "CRISPRi-FlowFISH",
                            rows: S,
                            columns: s.zI,
                            sortColumn: "p_val",
                            sortDirection: "asc",
                            emptyTableFallback: "This cCRE was not targeted in a CRISPRi-FlowFISH experiment",
                            loading: p,
                            error: !!g,
                        },
                        {
                            label: "eQTLs",
                            rows: v,
                            columns: s.CY,
                            sortColumn: "p_val",
                            sortDirection: "asc",
                            emptyTableFallback:
                                "This cCRE does not overlap a variant associated with significant changes in gene expression",
                            loading: p,
                            error: !!g,
                        },
                    ],
                    R = [
                        {
                            field: "name",
                            headerName: "Name",
                            flex: 1,
                            renderCell: (e) =>
                                e.value.startsWith("ENSG")
                                    ? (0, a.jsx)("i", { children: e.value })
                                    : (0, a.jsx)(c.g, {
                                          href: "/".concat(n.assembly, "/gene/").concat(e.value),
                                          children: (0, a.jsx)("i", { children: e.value }),
                                      }),
                        },
                        { field: "type", headerName: "Type" },
                        { field: "chromosome", headerName: "Chromosome" },
                        { field: "start", headerName: "Start", type: "number" },
                        { field: "stop", headerName: "End", type: "number" },
                        { field: "distance", headerName: "Distance", type: "number" },
                    ];
                return (0, a.jsxs)(r.default, {
                    spacing: 2,
                    children: [
                        (0, a.jsx)(o.XIK, {
                            rows: x,
                            columns: R,
                            label: "Closest Genes",
                            emptyTableFallback: "No closest genes found",
                            loading: f,
                            error: !!C,
                        }),
                        t && (0, a.jsx)(i.A, { tables: j }),
                    ],
                });
            }
        },
        16394: (e, n, t) => {
            t.d(n, { default: () => h });
            var a = t(95155),
                r = t(40650),
                l = t(83982),
                s = t(51760),
                i = t(52403),
                o = t(1684),
                c = t(12115);
            let d = (0, t(81362).J1)(
                    "\n  query geneOrtholog($name: [String]!, $assembly: String!) {\n    geneOrthologQuery: geneorthologQuery(name: $name, assembly: $assembly) {\n      humanGene: external_gene_name\n      mouseGene: mmusculus_homolog_associated_gene_name\n    }\n  }\n"
                ),
                u = [
                    {
                        headerName: "Gene",
                        field: "name",
                        renderCell: (e) =>
                            (0, a.jsx)(s.g, {
                                href: "/".concat(e.row.assembly, "/gene/").concat(e.row.name),
                                children: (0, a.jsx)("i", { children: e.value }),
                            }),
                    },
                    {
                        headerName: "Coordinates",
                        field: "coordinates",
                        valueGetter: (e, n) => (0, o.xi)(n.coordinates),
                    },
                ],
                h = (e) => {
                    let { entity: n } = e,
                        {
                            data: t,
                            loading: s,
                            error: o,
                        } = (0, r.IT)(d, { variables: { name: [n.entityID], assembly: n.assembly.toLowerCase() } }),
                        h = (0, c.useMemo)(
                            () =>
                                (null == t ? void 0 : t.geneOrthologQuery.length)
                                    ? null == t
                                        ? void 0
                                        : t.geneOrthologQuery[0]["GRCh38" == n.assembly ? "mouseGene" : "humanGene"]
                                    : null,
                            [null == t ? void 0 : t.geneOrthologQuery, n.assembly]
                        ),
                        m = "GRCh38" === n.assembly ? "mm10" : "GRCh38",
                        { data: p, loading: g, error: x } = (0, i.V)({ name: h, assembly: m, skip: !h }),
                        f = (0, c.useMemo)(() => {
                            if (t && p)
                                if (t.geneOrthologQuery.length)
                                    return [{ name: h, coordinates: p.coordinates, assembly: m }];
                                else return [];
                        }, [t, p, h, m]);
                    return (0, a.jsx)(l.XIK, {
                        rows: f,
                        columns: u,
                        label: ""
                            .concat(n.entityID, " ")
                            .concat("GRCh38" === n.assembly ? "Mouse (mm10)" : "Human (GRCh38)", " Ortholog"),
                        emptyTableFallback: "No "
                            .concat("GRCh38" === n.assembly ? "Mouse (mm10)" : "Human (GRCh38)", " ortholog found for ")
                            .concat(n.entityID),
                        loading: s || g,
                        error: !!(o || x),
                    });
                };
        },
        17889: (e, n, t) => {
            t.d(n, { Conservation: () => c });
            var a = t(95155);
            t(12115);
            var r = t(40650),
                l = t(83982),
                s = t(81362),
                i = t(51760);
            let o = (0, s.J1)(
                    "\n  query orthologTab($assembly: String!, $accession: [String!]) {\n    orthologQuery(accession: $accession, assembly: $assembly) {\n      assembly\n      accession\n      ortholog {\n        stop\n        start\n        chromosome\n        accession\n      }\n    }\n  }\n"
                ),
                c = (e) => {
                    let { entity: n } = e,
                        {
                            loading: t,
                            error: s,
                            data: c,
                        } = (0, r.IT)(o, {
                            variables: { assembly: "GRCh38" === n.assembly ? "grch38" : "mm10", accession: n.entityID },
                            fetchPolicy: "cache-and-network",
                            nextFetchPolicy: "cache-first",
                        }),
                        d = [];
                    if (c && c.orthologQuery.length > 0)
                        for (let e of c.orthologQuery[0].ortholog)
                            d.push({ accession: e.accession, chrom: e.chromosome, start: e.start, stop: e.stop });
                    let u = [
                        {
                            headerName: "Accession",
                            field: "accession",
                            renderCell: (e) =>
                                (0, a.jsx)(i.g, {
                                    href: "/"
                                        .concat("GRCh38" == n.assembly ? "mm10" : "GRCh38", "/ccre/")
                                        .concat(e.row.accession),
                                    children: e.value,
                                }),
                        },
                        { headerName: "Chromosome", field: "chrom" },
                        { headerName: "Start", field: "start" },
                        { headerName: "Stop", field: "stop" },
                    ];
                    return (0, a.jsx)(l.XIK, {
                        label: "Orthologous cCREs in ".concat("GRCh38" == n.assembly ? "mm10" : "GRCh38"),
                        loading: t,
                        error: !!s,
                        columns: u,
                        rows: d,
                        emptyTableFallback: "No Orthologous cCREs found",
                    });
                };
        },
        22218: (e, n, t) => {
            t.d(n, { default: () => m });
            var a = t(95155),
                r = t(96869),
                l = t(80357),
                s = t(43791),
                i = t(9325),
                o = t(84185),
                c = t(83982),
                d = t(51760);
            function u(e) {
                var n, t;
                let { snpid: r } = e,
                    { data: u, loading: h, error: m } = (0, i.A)(void 0, [r]),
                    p = (0, o.B)([r]),
                    g = p.data && (null == (n = p.data[r]) ? void 0 : n.ref),
                    x = p.data && (null == (t = p.data[r]) ? void 0 : t.alt),
                    f =
                        null == u
                            ? void 0
                            : u.map((e) => {
                                  let n = e.zscore;
                                  return (
                                      e.effect_allele === x &&
                                          e.ref_allele === g &&
                                          (n = e.zscore < 0 ? e.zscore : -e.zscore),
                                      { ...e, zscore: n }
                                  );
                              }),
                    C = [
                        {
                            field: "disease",
                            headerName: "Disease",
                            valueGetter: (e, n) => ("" === e ? n.study_source : e),
                        },
                        {
                            field: "zscore",
                            headerName: "Z-score",
                            type: "number",
                            valueFormatter: (e) => (null == e ? "" : "".concat(e.toFixed(2))),
                        },
                        { field: "study_source", headerName: "Source" },
                        {
                            field: "study_link",
                            headerName: "Study",
                            renderCell: (e) =>
                                (0, a.jsx)(d.g, {
                                    href: e.value,
                                    showExternalIcon: !e.row.isiCRE,
                                    openInNewTab: !e.row.isiCRE,
                                    children: e.value,
                                }),
                        },
                        {
                            field: "author",
                            headerName: "Author",
                            renderCell: (e) =>
                                e.value ? "".concat(e.value.replace(/(\d+)$/, " $1")) : (0, a.jsx)(a.Fragment, {}),
                        },
                    ];
                return (0, a.jsx)(l.default, {
                    width: "100%",
                    children: h
                        ? (0, a.jsx)(s.A, { variant: "rounded", width: "100%", height: 100 })
                        : (0, a.jsx)(c.XIK, {
                              rows: f.filter((e) => "" !== e.disease && "" !== e.study_source),
                              columns: C,
                              initialState: { sorting: { sortModel: [{ field: "zscore", sort: "desc" }] } },
                              label: "Immune GWAS Hits",
                              emptyTableFallback:
                                  "This variant is not identified in any genome wide association studies (GWAS)",
                          }),
                });
            }
            function h(e) {
                let { snpid: n } = e,
                    t = (0, o.B)([n], "variant"),
                    r = t.loading,
                    l = t.data && t.data[n] ? t.data[n].frequencies : [],
                    i = { SAS: "South Asian", EUR: "European", EAS: "East Asian", AMR: "American", AFR: "African" },
                    d = [
                        {
                            field: "row.population",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Population" }) }),
                            valueGetter: (e, n) => (n.population ? i[n.population] : ""),
                        },
                        {
                            field: "row.frequency",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Frequency" }) }),
                            valueGetter: (e, n) => (n.frequency ? n.frequency.toFixed(2) : ""),
                        },
                    ];
                return (0, a.jsx)(a.Fragment, {
                    children: r
                        ? (0, a.jsx)(s.A, { variant: "rounded", width: "100%", height: 400 })
                        : (0, a.jsx)(c.XIK, {
                              showToolbar: !0,
                              rows: l || [],
                              columns: d,
                              loading: r,
                              label: "Population Frequencies",
                          }),
                });
            }
            let m = (e) => {
                let { entity: n } = e;
                return (0, a.jsxs)(r.default, {
                    spacing: 2,
                    children: [(0, a.jsx)(h, { snpid: n.entityID }), (0, a.jsx)(u, { snpid: n.entityID })],
                });
            };
        },
        23223: (e, n, t) => {
            t.d(n, { default: () => w });
            var a = t(95155),
                r = t(36822),
                l = t(12115),
                s = t(78062),
                i = t(33427),
                o = t(25789),
                c = t(28278),
                d = t(80317),
                u = t(83982),
                h = t(88816),
                m = t(24288),
                p = t(50301),
                g = t(1684),
                x = t(78030),
                f = t(9770),
                C = t(79194);
            let y = (e) => {
                let {
                        enrichmentdata: n,
                        onSelectionChange: t,
                        setSortedFilteredData: r,
                        selected: s,
                        sortedFilteredData: y,
                    } = e,
                    [b, S] = (0, l.useState)(!1),
                    { data: v, loading: j, error: R } = n,
                    E = (0, o.default)(),
                    N = (0, c.A)(E.breakpoints.down("sm")),
                    A = (0, x.b)(),
                    w = [
                        {
                            ...u.fgx,
                            sortable: !0,
                            hideable: !1,
                            renderHeader: (e) =>
                                (0, a.jsx)("div", {
                                    id: "StopPropagationWrapper",
                                    onClick: (e) => e.stopPropagation(),
                                    children: (0, a.jsx)(u.fgx.renderHeader, { ...e }),
                                }),
                        },
                        {
                            field: "displayname",
                            headerName: "Biosample",
                            valueGetter: (e, n) => (0, g.Zr)(n.displayname),
                            renderCell: (e) =>
                                (0, a.jsx)("div", {
                                    style: {
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: 150,
                                    },
                                    title: e.value,
                                    children: e.value,
                                }),
                        },
                        { field: "fc", headerName: "Fold Change", valueGetter: (e, n) => n.fc.toFixed(3) },
                        { field: "fdr", headerName: "FDR", valueGetter: (e, n) => n.fdr.toFixed(3) },
                        { field: "pvalue", headerName: "P", valueGetter: (e, n) => n.pvalue.toFixed(3) },
                        { field: "ontology", headerName: "Tissue", valueGetter: (e, n) => n.ontology },
                        {
                            field: "link",
                            headerName: "Experiment",
                            sortable: !1,
                            disableColumnMenu: !0,
                            valueGetter: (e, n) => n.accession.split(" ")[0],
                            renderCell: (e) =>
                                (0, a.jsx)(m.A, {
                                    href: "https://www.encodeproject.org/experiments/".concat(e.value, "/"),
                                    target: "_blank",
                                    size: "small",
                                    children: (0, a.jsx)(h.A, { fontSize: "small" }),
                                }),
                        },
                    ],
                    T = (0, l.useMemo)(
                        () =>
                            (0, a.jsx)(p.A, {
                                title: "Suggested Biosamples: Suggested biosamples to investigate based on cCRE enrichment as calculated by the Variant Enrichment and Sample Prioritization Analysis (VESPA) pipeline",
                                children: (0, a.jsx)(i.A, { fontSize: "inherit" }),
                            }),
                        []
                    ),
                    k = (0, l.useMemo)(() => [{ field: "fc", sort: "desc" }], []),
                    _ = (0, l.useMemo)(() => (0, a.jsx)(C.A, { autoSort: b, setAutoSort: S }), [b]);
                return (
                    (0, l.useEffect)(() => {
                        let e = null == A ? void 0 : A.current;
                        if (e) {
                            if (!b) return void e.setSortModel(k);
                            e.setSortModel(
                                (null == s ? void 0 : s.length) > 0 ? [{ field: "__check__", sort: "desc" }] : k
                            );
                        }
                    }, [A, b, k, s]),
                    R
                        ? (0, a.jsx)(d.default, { children: "Error Fetching GWAS Enrichment" })
                        : (0, a.jsx)(a.Fragment, {
                              children: (0, a.jsx)(u.XIK, {
                                  apiRef: A,
                                  showToolbar: !0,
                                  rows: v || [],
                                  columns: w,
                                  loading: j,
                                  label: "Suggested Biosamples",
                                  emptyTableFallback: "No Suggested Biosamples found for this study",
                                  initialState: { sorting: { sortModel: k } },
                                  checkboxSelection: !0,
                                  getRowId: (e) => e.accession,
                                  onRowSelectionModelChange: (e) => {
                                      t(Array.from(e.ids).map((e) => v.find((n) => n.accession === e)));
                                  },
                                  rowSelectionModel: { type: "include", ids: new Set(s.map((e) => e.accession)) },
                                  keepNonExistentRowsSelected: !0,
                                  onStateChange: () => {
                                      let e = (0, f.oU)(A).map((e) => e.model);
                                      ((e, n) => {
                                          if (e.length !== n.length || JSON.stringify(e[0]) !== JSON.stringify(n[0]))
                                              return !1;
                                          for (let t = 0; t < e.length; t++)
                                              if (e[t].accession !== n[t].accession) return !1;
                                          return !0;
                                      })(y, e) || r(e);
                                  },
                                  divHeight: { height: "100%", minHeight: N ? "none" : "580px" },
                                  labelTooltip: T,
                                  toolbarSlot: _,
                              }),
                          })
                );
            };
            var b = t(40650),
                S = t(78224);
            let v = (0, S.J)(
                    "\n  query GetcCreBiosampleMetadataQuery($assembly: String!) {\n    ccREBiosampleQuery(assembly: $assembly) {\n      biosamples {\n        name\n        ontology\n        lifeStage      \n        sampleType\n        displayname\n        __typename\n      }\n      __typename\n    }\n  }"
                ),
                j = (0, S.J)(
                    "\n  query getGWASCTEnrichmentQuery($study: String!) {\n  getGWASCtEnrichmentQuery(study: $study) {\n    celltype\n    accession\n    fc\n    fdr\n    pvalue\n    __typename\n  }\n}"
                );
            var R = t(93320),
                E = t(80357),
                N = t(94434);
            let A = (e) => {
                    let { data: n, selected: t, sortedFilteredData: r, ref: s, study: i, ...o } = e,
                        c = (0, l.useMemo)(
                            () =>
                                r
                                    ? r.map((e, n) => {
                                          var a;
                                          let r = t.length > 0,
                                              l = t.some((n) => n.accession === e.accession);
                                          return {
                                              category: e.ontology,
                                              label: ((e, n, t) => {
                                                  let a = null == n ? void 0 : n.replaceAll("_", " ");
                                                  return (
                                                      (null == a ? void 0 : a.length) > 50 &&
                                                          (a = (null == a ? void 0 : a.slice(0, 50)) + "..."),
                                                      (a = (0, g.Zr)(a)),
                                                      "".concat(e.toFixed(2), ", ").concat(t, ",").concat(a)
                                                  );
                                              })(e.fc, e.displayname, e.accession),
                                              value: e.fc,
                                              color:
                                                  (r && l) || !r
                                                      ? null != (a = N.Me[e.ontology])
                                                          ? a
                                                          : N.Me.missing
                                                      : "#CCCCCC",
                                              id: n.toString(),
                                              metadata: e,
                                              lollipopValue: e.fdr,
                                          };
                                      })
                                    : [],
                            [r, t]
                        );
                    return (0, a.jsx)(E.default, {
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                        padding: 1,
                        sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" },
                        children: (0, a.jsx)(R.bH, {
                            barSize: 3,
                            barSpacing: 20,
                            legendTitle: "FDR",
                            ...o,
                            data: c,
                            topAxisLabel: "Log2(Fold Enrichment)",
                            TooltipContents: (e) =>
                                (0, a.jsx)(a.Fragment, {
                                    children: (0, a.jsxs)("div", {
                                        style: { padding: 2 },
                                        children: [
                                            (0, a.jsx)("strong", { children: e.label }),
                                            (0, a.jsx)("br", {}),
                                            e.metadata &&
                                                (0, a.jsxs)("div", { children: ["FDR: ", e.metadata.fdr.toFixed(3)] }),
                                        ],
                                    }),
                                }),
                            ref: s,
                            downloadFileName: "".concat(i, "_lollipop_plot"),
                        }),
                    });
                },
                w = (e) => {
                    let { entity: n } = e,
                        {
                            data: t,
                            loading: i,
                            error: o,
                        } = ((e) => {
                            let { study: n } = e,
                                { data: t, loading: a, error: r } = (0, b.IT)(j, { variables: { study: n }, skip: !n }),
                                { data: l, loading: s, error: i } = (0, b.IT)(v, { variables: { assembly: "grch38" } });
                            return {
                                data:
                                    !s && !a && l && t
                                        ? t.getGWASCtEnrichmentQuery.map((e) => {
                                              let n = l.ccREBiosampleQuery.biosamples.find(
                                                  (n) => n.name === e.celltype
                                              );
                                              return {
                                                  ...e,
                                                  fc: Math.log2(e.fc + 1e-6),
                                                  pvalue: 0 === e.pvalue ? 1e-300 : e.pvalue,
                                                  fdr: 0 === e.fdr ? 1e-300 : e.fdr,
                                                  ontology: null == n ? void 0 : n.ontology,
                                                  displayname: null == n ? void 0 : n.displayname,
                                              };
                                          })
                                        : void 0,
                                loading: a || s,
                                error: r || i,
                            };
                        })({ study: n.entityID }),
                        [c, d] = (0, l.useState)([]),
                        [u, h] = (0, l.useState)([]),
                        m = (0, l.useRef)(null);
                    return (0, a.jsx)(a.Fragment, {
                        children: (0, a.jsx)(r.A, {
                            TableComponent: (0, a.jsx)(y, {
                                enrichmentdata: { data: t, loading: i, error: o },
                                selected: c,
                                onSelectionChange: (e) => {
                                    d(e);
                                },
                                sortedFilteredData: u,
                                setSortedFilteredData: h,
                            }),
                            plots: [
                                {
                                    tabTitle: "Bar Plot",
                                    icon: (0, a.jsx)(s.A, {}),
                                    plotComponent:
                                        t && t.length > 0
                                            ? (0, a.jsx)(A, {
                                                  data: { data: t, loading: i, error: o },
                                                  selected: c,
                                                  sortedFilteredData: u,
                                                  onBarClicked: (e) => {
                                                      c.includes(e.metadata)
                                                          ? d(c.filter((n) => n !== e.metadata))
                                                          : d([...c, e.metadata]);
                                                  },
                                                  ref: m,
                                                  study: n.entityID,
                                              })
                                            : (0, a.jsx)(a.Fragment, {}),
                                    ref: m,
                                },
                            ],
                        }),
                    });
                };
        },
        24663: (e, n, t) => {
            t.d(n, { OpenEntitiesContext: () => s, OpenEntitiesContextProvider: () => i });
            var a = t(95155),
                r = t(12115);
            let l = (e, n) => {
                    let t;
                    switch (n.type) {
                        case "addEntity":
                            t = e.some((e) => e.entityID === n.entity.entityID && e.assembly === n.entity.assembly)
                                ? e
                                : [...e, n.entity];
                            break;
                        case "removeEntity":
                            t =
                                e.length > 1
                                    ? e.filter(
                                          (e) =>
                                              e.entityID !== n.entity.entityID ||
                                              e.entityType !== n.entity.entityType ||
                                              e.assembly !== n.entity.assembly
                                      )
                                    : e;
                            break;
                        case "updateEntity":
                            t = e.map((e) =>
                                e.entityID === n.entity.entityID && e.assembly === n.entity.assembly ? n.entity : e
                            );
                            break;
                        case "reorder": {
                            let a = [...e],
                                [r] = a.splice(n.startIndex, 1);
                            a.splice(n.endIndex, 0, r), (t = a);
                            break;
                        }
                        case "sort": {
                            let n = ["GRCh38", "mm10"],
                                a = ["region", "gene", "ccre", "variant", "gwas"],
                                r = [...e];
                            r.sort((e, t) => {
                                let r = n.indexOf(e.assembly) - n.indexOf(t.assembly);
                                if (0 !== r) return r;
                                let l = a.indexOf(e.entityType) - a.indexOf(t.entityType);
                                return 0 !== l ? l : e.entityID.localeCompare(t.entityID);
                            }),
                                (t = r);
                            break;
                        }
                        case "setState":
                            t = n.state;
                    }
                    return t;
                },
                s = (0, r.createContext)(null),
                i = (e) => {
                    let { children: n } = e,
                        [t, i] = (0, r.useReducer)(l, []);
                    return (0, a.jsx)(s.Provider, { value: [t, i], children: n });
                };
        },
        27919: (e, n, t) => {
            t.d(n, { A: () => u });
            var a = t(95155),
                r = t(80207),
                l = t(40650),
                s = t(94434),
                i = t(12115);
            let o = (0, r.J1)(
                    "\n  query cCRE_1(\n    $assembly: String!\n    $accession: [String!]\n    $experiments: [String!]\n  ) {\n    cCREQuery(assembly: $assembly, accession: $accession) {\n      group\n      zScores(experiments: $experiments) {\n        experiment\n        score\n      }\n    }\n  }\n"
                ),
                c = (0, r.J1)(
                    '\n  query cCRE_2($assembly: String!, $accession: [String!]) {\n    cCREQuery(assembly: $assembly, accession: $accession) {\n      group\n      dnase: maxZ(assay: "dnase")\n      h3k4me3: maxZ(assay: "h3k4me3")\n      h3k27ac: maxZ(assay: "h3k27ac")\n      ctcf: maxZ(assay: "ctcf")\n      atac: maxZ(assay: "atac")\n    }\n  }\n'
                ),
                d = ["DNase", "H3K4me3", "H3K27ac", "CTCF", "ATAC"],
                u = (e) => {
                    var n, t, r, u;
                    let { assembly: h, name: m, biosample: p } = e,
                        g = (0, i.useMemo)(
                            () =>
                                p
                                    ? ((e) => [e.dnase, e.h3k4me3, e.h3k27ac, e.ctcf, e.atac].filter((e) => !!e))(p)
                                    : ["dnase", "h3k4me3", "h3k27ac", "ctcf", "atac"],
                            [p]
                        ),
                        {
                            data: x,
                            loading: f,
                            error: C,
                        } = (0, l.IT)(p ? o : c, { variables: { assembly: h, accession: m, experiments: g } }),
                        y = !f && (null == x || null == (n = x.cCREQuery) ? void 0 : n[0]) ? 210 : 40;
                    return (0, a.jsxs)("svg", {
                        width: 400,
                        height: y,
                        children: [
                            (0, a.jsx)("rect", {
                                width: 400,
                                height: y,
                                fill: "#ffffff",
                                stroke: "#000000",
                                strokeWidth: "2",
                                rx: "4",
                                ry: "4",
                            }),
                            !f && (null == x || null == (t = x.cCREQuery) ? void 0 : t[0])
                                ? (0, a.jsxs)("g", {
                                      children: [
                                          (0, a.jsx)("rect", {
                                              x: 16,
                                              y: 19,
                                              width: 10,
                                              height: 10,
                                              fill:
                                                  (null == (r = s.N8.get(x.cCREQuery[0].group))
                                                      ? void 0
                                                      : r.split(":")[1]) || "#8c8c8c",
                                          }),
                                          (0, a.jsx)("text", {
                                              x: 32,
                                              y: 28,
                                              fontSize: "24",
                                              fontFamily: "Arial, sans-serif",
                                              fill: "#000000",
                                              children: m,
                                          }),
                                          (0, a.jsx)("text", {
                                              x: 16,
                                              y: 51,
                                              fontSize: "21",
                                              fontFamily: "Arial, sans-serif",
                                              fill: "#000000",
                                              children:
                                                  null == (u = s.N8.get(x.cCREQuery[0].group))
                                                      ? void 0
                                                      : u.split(":")[0],
                                          }),
                                          (0, a.jsx)("text", {
                                              x: 16,
                                              y: 71,
                                              fontSize: "19",
                                              fontFamily: "Arial, sans-serif",
                                              fill: "#666666",
                                              children: "Click for details about this cCRE",
                                          }),
                                          (0, a.jsx)("text", {
                                              x: 16,
                                              y: 101,
                                              fontSize: "19",
                                              fontFamily: "Arial, sans-serif",
                                              fontWeight: "bold",
                                              fill: "#000000",
                                              children: p
                                                  ? "Z-scores in " + p.displayname
                                                  : "Max Z-scores across all biosamples:",
                                          }),
                                          (p
                                              ? ((e) =>
                                                    [e.dnase, e.h3k4me3, e.h3k27ac, e.ctcf, e.atac]
                                                        .map((e, n) => e && d[n])
                                                        .filter((e) => !!e))(p)
                                              : d
                                          ).map((e, n) => {
                                              var t, r;
                                              let l = 51 + 20 * (3.5 + n),
                                                  s = p
                                                      ? null ==
                                                        (t = x.cCREQuery[0].zScores.find((e) => e.experiment === g[n]))
                                                          ? void 0
                                                          : t.score.toFixed(2)
                                                      : null == (r = x.cCREQuery[0][g[n]])
                                                        ? void 0
                                                        : r.toFixed(2);
                                              return (0, a.jsxs)(
                                                  "g",
                                                  {
                                                      children: [
                                                          (0, a.jsxs)("text", {
                                                              x: 16,
                                                              y: l,
                                                              fontSize: "19",
                                                              fontFamily: "Arial, sans-serif",
                                                              fontWeight: "bold",
                                                              fill: "#000000",
                                                              children: [e, ":"],
                                                          }),
                                                          (0, a.jsx)("text", {
                                                              x: 136,
                                                              y: l,
                                                              fontSize: "19",
                                                              fontFamily: "Arial, sans-serif",
                                                              fill: "#000000",
                                                              children: s,
                                                          }),
                                                      ],
                                                  },
                                                  n
                                              );
                                          }),
                                      ],
                                  })
                                : (0, a.jsx)("g", {
                                      children: (0, a.jsx)("circle", {
                                          cx: 200,
                                          cy: y / 2,
                                          r: "8",
                                          fill: "none",
                                          stroke: "#1976d2",
                                          strokeWidth: "2",
                                          strokeDasharray: "12.57",
                                          strokeDashoffset: "0",
                                          children: (0, a.jsx)("animateTransform", {
                                              attributeName: "transform",
                                              type: "rotate",
                                              values: "0 50 50;360 50 50",
                                              dur: "1s",
                                              repeatCount: "indefinite",
                                          }),
                                      }),
                                  }),
                        ],
                    });
                };
        },
        29726: (e, n, t) => {
            t.d(n, { CY: () => x, gI: () => p, gW: () => m, zI: () => g });
            var a = t(95155),
                r = t(80317),
                l = t(51760),
                s = t(1684);
            let i = {
                    field: "gene",
                    headerName: "Common Gene Name",
                    renderCell: (e) =>
                        e.value.startsWith("ENSG")
                            ? (0, a.jsx)("i", { children: e.value })
                            : (0, a.jsx)(l.g, {
                                  href: "/GRCh38/gene/".concat(e.value),
                                  children: (0, a.jsx)("i", { children: e.value }),
                              }),
                },
                o = {
                    field: "genetype",
                    headerName: "Gene Type",
                    valueGetter: (e, n) =>
                        ((e, n) =>
                            n.genetype
                                ? "lncRNA" === n.genetype
                                    ? n.genetype
                                    : n.genetype
                                          .replaceAll("_", " ")
                                          .split(" ")
                                          .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                          .join(" ")
                                : e)(e, n),
                },
                c = {
                    field: "experiment_accession",
                    headerName: "Experiment ID",
                    renderCell: (e) =>
                        (0, a.jsx)(l.g, {
                            href: "https://www.encodeproject.org/experiments/".concat(e.value),
                            openInNewTab: !0,
                            showExternalIcon: !0,
                            children: e.value,
                        }),
                },
                d = { field: "displayname", headerName: "Biosample" },
                u = { field: "score", headerName: "Score", type: "number" },
                h = {
                    field: "p_val",
                    headerName: "P",
                    type: "number",
                    display: "flex",
                    renderHeader: () =>
                        (0, a.jsx)(r.default, {
                            variant: "body2",
                            pr: 0.1,
                            children: (0, a.jsx)("i", { children: "P" }),
                        }),
                    renderCell: (e) => (0 === e.value ? "0" : (0, s.pk)(e.value, 2, { variant: "body2" })),
                },
                m = [i, { ...o, minWidth: 65 }, c, { ...d, minWidth: 85 }, u, { ...h, minWidth: 85 }],
                p = [
                    i,
                    { ...o, minWidth: 65 },
                    { field: "assay", headerName: "Assay Type", minWidth: 85 },
                    c,
                    { ...d, minWidth: 85 },
                    u,
                ],
                g = [
                    i,
                    { ...o, minWidth: 65 },
                    { field: "grnaid", headerName: "gRNA ID" },
                    { ...c, flex: 1.25 },
                    { ...d, minWidth: 85 },
                    { field: "effectsize", headerName: "Effect Size" },
                    h,
                ],
                x = [
                    i,
                    { ...o, minWidth: 100 },
                    { field: "variantid", headerName: "Variant ID", minWidth: 140 },
                    { field: "source", headerName: "Source", minWidth: 75 },
                    { field: "tissue", headerName: "Tissue", minWidth: 85 },
                    { field: "slope", headerName: "Slope", type: "number" },
                    { ...h, minWidth: 85 },
                ];
        },
        32941: (e, n, t) => {
            t.d(n, { z: () => i });
            var a = t(40650),
                r = t(78224);
            let l = (0, r.J)(
                    "\n    query bedIntersectCCRE ($inp: [cCRE]!, $assembly: String!, $maxOutputLength: Int) {\n      intersection (\n        userCcres: $inp,\n        assembly: $assembly,\n        maxOutputLength: $maxOutputLength\n      )\n    }\n  "
                ),
                s = (0, r.J)(
                    "\n  query getSNPsforgivengwasStudy($study: [String!]!) {\n    getSNPsforGWASStudies(study: $study) {\n      snpid\n      ldblock\n      rsquare\n      chromosome\n      stop\n      start\n      ldblocksnpid\n      __typename\n    }\n  }"
                ),
                i = (e) => {
                    let { study: n } = e,
                        {
                            data: t,
                            loading: r,
                            error: i,
                        } = (0, a.IT)(s, {
                            variables: { study: n },
                            fetchPolicy: "cache-and-network",
                            nextFetchPolicy: "cache-first",
                            skip: !n || 0 === n.length,
                        }),
                        o =
                            t &&
                            t.getSNPsforGWASStudies.map((e) => [
                                e.chromosome.toString(),
                                e.start.toString(),
                                e.stop.toString(),
                                e.snpid.toString(),
                                e.rsquare.toString(),
                                e.ldblocksnpid.toString(),
                                e.ldblock.toString(),
                            ]),
                        {
                            data: c,
                            loading: d,
                            error: u,
                        } = (0, a.IT)(l, {
                            variables: { inp: o, assembly: "grch38", maxOutputLength: 1e4 },
                            fetchPolicy: "cache-and-network",
                            nextFetchPolicy: "cache-first",
                            skip: r || (t && 0 === t.getSNPsforGWASStudies.length) || !o || 0 === o.length,
                        });
                    return {
                        data:
                            c && c.intersection.length > 0
                                ? c.intersection.map((e) => ({
                                      accession: e[4],
                                      snpid: e[9],
                                      ldblocksnpid: e[11],
                                      ldblock: e[12],
                                      rsquare: e[10],
                                  }))
                                : void 0,
                        loading: r || d,
                        error: i || u,
                    };
                };
        },
        33961: (e, n, t) => {
            t.d(n, { AdditionalChromatinSignatures: () => R });
            var a = t(95155),
                r = t(40650),
                l = t(12115),
                s = t(83982),
                i = t(80357),
                o = t(75416),
                c = t(96869),
                d = t(82293),
                u = t(78224),
                h = t(51760),
                m = t(41189),
                p = t(9877),
                g = t(11731),
                x = t(23938),
                f = t(93320),
                C = t(10152);
            let y = (0, u.J)(
                    "\nquery ENTEXQuery($accession: String!){\n  entexQuery(accession: $accession){\n    assay\n    accession\n    hap1_count\n    hap2_count\n    hap1_allele_ratio\n    p_betabinom\n    experiment_accession\n    tissue\n    donor    \n    imbalance_significance\n  }\n}\n"
                ),
                b = (0, u.J)(
                    "\nquery entexActiveAnnotationsQuery( $coordinates: GenomicRangeInput! ) {\n    entexActiveAnnotationsQuery(coordinates: $coordinates) {\n        tissue\n        assay_score\n    }\n\n}"
                ),
                S = [
                    { headerName: "Organ/Tissue", field: "tissue" },
                    { headerName: "Biosample", field: "biosample" },
                    {
                        headerName: "State",
                        field: "state",
                        renderCell: (e) =>
                            (0, a.jsx)("b", { style: { color: e.row.color }, children: (0, m.Gp)(e.value) }),
                    },
                    { headerName: "Chromosome", field: "chr" },
                    { headerName: "Start", field: "start", type: "number" },
                    { headerName: "End", field: "end", type: "number" },
                ],
                v = [
                    {
                        headerName: "Tissue",
                        field: "tissue",
                        valueFormatter: (e) =>
                            e
                                .split("_")
                                .map((e) => e[0].toUpperCase() + e.slice(1))
                                .join(" "),
                    },
                    { headerName: "Assay", field: "assay", valueFormatter: (e) => e.replaceAll("_", ", ") },
                    { headerName: "Donor", field: "donor" },
                    { headerName: "Hap 1 Count", field: "hap1_count", type: "number" },
                    { headerName: "Hap 2 Count", field: "hap2_count", type: "number" },
                    {
                        headerName: "Hap 1 Allele Ratio",
                        field: "hap1_allele_ratio",
                        type: "number",
                        valueFormatter: (e) => e.toFixed(2),
                    },
                    {
                        headerName: "Experiment Accession",
                        field: "experiment_accession",
                        renderCell: (e) =>
                            (0, a.jsx)(h.g, {
                                href: "https://www.encodeproject.org/experiments/".concat(e.value),
                                openInNewTab: !0,
                                showExternalIcon: !0,
                                children: e.value,
                            }),
                    },
                    {
                        headerName: "p Beta-Binomial",
                        field: "p_betabinom",
                        type: "number",
                        valueFormatter: (e) => e.toFixed(2),
                    },
                    { headerName: "Imbalance Significance", field: "imbalance_significance", type: "number" },
                ],
                j = [
                    {
                        headerName: "Tissue",
                        field: "tissue",
                        valueFormatter: (e) =>
                            e
                                .split("_")
                                .map((e) => e[0].toUpperCase() + e.slice(1))
                                .join(" "),
                    },
                    {
                        headerName: "Supporting Assays",
                        field: "assay_score",
                        valueFormatter: (e) =>
                            e
                                .split("|")
                                .map((e) => e.split(":")[0])
                                .join(", "),
                    },
                ],
                R = (e) => {
                    let { entity: n } = e,
                        [t, u] = (0, l.useState)(1),
                        { data: h, loading: R, error: E } = (0, d.H)({ assembly: n.assembly, accession: n.entityID }),
                        N = h && {
                            chromosome: null == h ? void 0 : h.chrom,
                            start: null == h ? void 0 : h.start,
                            end: (null == h ? void 0 : h.start) + (null == h ? void 0 : h.len),
                        },
                        { data: A, loading: w, error: T } = (0, r.IT)(y, { variables: { accession: n.entityID } }),
                        { data: k, loading: _, error: I } = (0, r.IT)(b, { variables: { coordinates: N }, skip: !N }),
                        { tracks: M, processedTableData: F, loading: G, error: P } = (0, m.Nr)(N);
                    return (0, a.jsxs)(p.Ay, {
                        value: t,
                        children: [
                            (0, a.jsx)(i.default, {
                                sx: { borderBottom: 1, borderColor: "divider" },
                                children: (0, a.jsxs)(g.A, {
                                    onChange: (e, n) => u(n),
                                    "aria-label": "ChromHMM ENTEx tabs",
                                    children: [
                                        (0, a.jsx)(o.A, { label: "ChromHMM States", value: 1 }),
                                        (0, a.jsx)(o.A, { label: "ENTEx Data", value: 2 }),
                                    ],
                                }),
                            }),
                            (0, a.jsxs)(x.A, {
                                value: 1,
                                sx: { p: 0 },
                                children: [
                                    (0, a.jsx)(f.nD, {
                                        label: "ChromHMM State Proportions, All Tissues:",
                                        data: (0, f.jK)(F, "state", m.uo),
                                        getColor: (e) => C.PE[e].color,
                                        formatLabel: (e) => (0, m.Gp)(e),
                                        loading: G || !!P,
                                        tooltipTitle: "ChromHMM State Proportions, All Tissues",
                                        style: { marginBottom: "8px" },
                                    }),
                                    (0, a.jsx)(s.XIK, {
                                        label: "ChromHMM States",
                                        columns: S,
                                        rows: F,
                                        loading: G,
                                        error: !!P,
                                        divHeight: { height: "600px" },
                                        initialState: { sorting: { sortModel: [{ field: "tissue", sort: "asc" }] } },
                                    }),
                                ],
                            }),
                            (0, a.jsx)(x.A, {
                                value: 2,
                                sx: { p: 0 },
                                children: (0, a.jsxs)(c.default, {
                                    spacing: 2,
                                    children: [
                                        (0, a.jsx)(s.XIK, {
                                            label: "ENTEx",
                                            columns: v,
                                            rows: null == A ? void 0 : A.entexQuery,
                                            loading: w,
                                            error: !!T,
                                            initialState: {
                                                sorting: { sortModel: [{ field: "hap1_allele_ratio", sort: "asc" }] },
                                            },
                                        }),
                                        (0, a.jsx)(s.XIK, {
                                            label: "ENTEx Active Annotations",
                                            columns: j,
                                            rows: null == k ? void 0 : k.entexActiveAnnotationsQuery,
                                            loading: _,
                                            error: !!I,
                                            initialState: {
                                                sorting: { sortModel: [{ field: "tissue", sort: "asc" }] },
                                            },
                                        }),
                                    ],
                                }),
                            }),
                        ],
                    });
                };
        },
        35448: (e, n, t) => {
            t.d(n, { Q: () => l });
            var a = t(40650);
            let r = (0, t(78224).J)(
                    "\n  query getSNPsforgivengwasStudy($study: [String!]!) {\n    getSNPsforGWASStudies(study: $study) {\n      snpid\n      ldblock\n      rsquare\n      chromosome\n      stop\n      start\n      ldblocksnpid\n      __typename\n    }\n  }"
                ),
                l = (e) => {
                    let { study: n } = e,
                        {
                            data: t,
                            loading: l,
                            error: s,
                        } = (0, a.IT)(r, { variables: { study: n }, skip: !n || 0 === n.length });
                    return { data: null == t ? void 0 : t.getSNPsforGWASStudies, loading: l, error: s };
                };
        },
        36376: (e, n, t) => {
            t.d(n, { GWASStudyGenes: () => T });
            var a = t(95155),
                r = t(83982),
                l = t(80317),
                s = t(50301),
                i = t(64647),
                o = t(80357),
                c = t(51760),
                d = t(1684),
                u = t(12115),
                h = t(33427),
                m = t(75265),
                p = t(96869),
                g = t(2021),
                x = t(24288),
                f = t(99496),
                C = t(56919),
                y = t(7291),
                b = t(1123),
                S = t(66370),
                v = t(35577);
            let j = {
                    "ABC_(DNase_only)": "Activity-By-Contact model using DNase data only",
                    "ABC_(full)": "Activity-By-Contact model using DNase, histone marks, and other signals",
                    EPIraction: "Predicts enhancer–promoter interactions using regression on chromatin features",
                    GraphRegLR: "Graph attention network trained on 2 Mb genomic bins",
                    "rE2G_(DNase_only)": "Regulatory Element to Gene mapping using DNase data only",
                    "rE2G_(extended)": "Extended Regulatory Element to Gene mapping using multiple features",
                },
                R = (e) => {
                    let { method: n, open: t, setOpen: r, onMethodSelect: l } = e,
                        [o, c] = (0, u.useState)(n);
                    return (0, a.jsxs)(m.A, {
                        open: t,
                        onClose: () => r(!1),
                        disableRestoreFocus: !0,
                        children: [
                            (0, a.jsxs)(p.default, {
                                direction: "row",
                                justifyContent: "space-between",
                                children: [
                                    (0, a.jsx)(g.A, { children: "Select Computational Gene Linking Method" }),
                                    (0, a.jsx)(x.A, {
                                        size: "large",
                                        onClick: () => r(!1),
                                        sx: { mr: 1 },
                                        children: (0, a.jsx)(v.A, { fontSize: "inherit" }),
                                    }),
                                ],
                            }),
                            (0, a.jsx)(f.A, {
                                children: (0, a.jsx)(C.A, {
                                    value: o,
                                    onChange: (e) => c(e.target.value),
                                    children: [
                                        "ABC_(DNase_only)",
                                        "ABC_(full)",
                                        "EPIraction",
                                        "GraphRegLR",
                                        "rE2G_(DNase_only)",
                                        "rE2G_(extended)",
                                    ].map((e) =>
                                        (0, a.jsx)(
                                            y.A,
                                            {
                                                value: e,
                                                control: (0, a.jsx)(b.A, {}),
                                                label: (0, a.jsxs)(p.default, {
                                                    direction: "row",
                                                    alignItems: "center",
                                                    spacing: 0.5,
                                                    children: [
                                                        (0, a.jsx)("span", { children: e.replaceAll("_", " ") }),
                                                        (0, a.jsx)(s.A, {
                                                            title: j[e],
                                                            children: (0, a.jsx)(x.A, {
                                                                size: "small",
                                                                children: (0, a.jsx)(h.A, { fontSize: "small" }),
                                                            }),
                                                        }),
                                                    ],
                                                }),
                                            },
                                            e
                                        )
                                    ),
                                }),
                            }),
                            (0, a.jsx)(S.A, {
                                children: (0, a.jsx)(i.default, {
                                    sx: { textTransform: "none" },
                                    variant: "contained",
                                    onClick: () => {
                                        l(o), r(!1);
                                    },
                                    children: "Submit",
                                }),
                            }),
                        ],
                    });
                };
            var E = t(81387),
                N = t(40650);
            let A = (0, t(78224).J)(
                "\n  query ComputationalGeneLinks($accession: [String]!, $method: [String]){\n    ComputationalGeneLinksQuery(accession: $accession, method: $method){\n      genename\n      accession\n      geneid\n      genetype\n      method\n      celltype\n      score\n      methodregion\n      fileaccession\n    }\n  }\n"
            );
            var w = t(32941);
            let T = (e) => {
                let { entity: n } = e,
                    [t, h] = (0, u.useState)("rE2G_(DNase_only)"),
                    { data: m, loading: p, error: g } = (0, w.z)({ study: [n.entityID] }),
                    { data: x, loading: f, error: C } = (0, E.A)(m ? [...new Set(m.map((e) => e.accession))] : []),
                    {
                        data: y,
                        loading: b,
                        error: S,
                    } = ((e) => {
                        let { accessions: n, method: t } = e,
                            {
                                data: a,
                                loading: r,
                                error: l,
                            } = (0, N.IT)(A, {
                                variables: { accession: n, method: [t] },
                                fetchPolicy: "cache-and-network",
                                nextFetchPolicy: "cache-first",
                                skip: !n || 0 === n.length,
                                errorPolicy: "all",
                            });
                        return { data: a ? a.ComputationalGeneLinksQuery : void 0, loading: r, error: l };
                    })({ accessions: m ? [...new Set(m.map((e) => e.accession))] : [], method: t }),
                    [v, j] = (0, u.useState)(null),
                    T = x && x.filter((e) => "Intact-HiC" === e.assay),
                    k = x && x.filter((e) => "RNAPII-ChIAPET" === e.assay || "CTCF-ChIAPET" === e.assay),
                    _ = x && x.filter((e) => "CRISPR" === e.method),
                    I = x && x.filter((e) => "eQTLs" === e.method),
                    M = [
                        {
                            field: "accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "cCRE Accession" }) }),
                            valueGetter: (e, n) => n.accession,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/ccre/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "fileaccession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "File Accession" }) }),
                            valueGetter: (e, n) => n.fileaccession,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "https://www.encodeproject.org/file/".concat(e.value),
                                    openInNewTab: !0,
                                    showExternalIcon: !0,
                                    children: e.value,
                                }),
                        },
                        {
                            field: "genename",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Common Gene Name" }) }),
                            valueGetter: (e, n) => n.genename,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/gene/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "geneid",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Gene ID" }) }),
                            valueGetter: (e, n) => n.geneid,
                        },
                        {
                            field: "genetype",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Gene Type" }) }),
                            valueGetter: (e, n) =>
                                "lncRNA" === n.genetype
                                    ? n.genetype
                                    : n.genetype
                                          .replaceAll("_", " ")
                                          .split(" ")
                                          .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                          .join(" "),
                        },
                        {
                            field: "method",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Method" }) }),
                            valueGetter: (e, n) => n.method.replaceAll("_", " "),
                        },
                        {
                            field: "methodregion",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Method Region" }) }),
                            valueGetter: (e, n) =>
                                (function (e) {
                                    let [n, t, a] = e.split("_");
                                    return "".concat(n, ":").concat(t, "-").concat(a);
                                })(n.methodregion),
                        },
                        {
                            field: "celltype",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Biosample" }) }),
                            valueGetter: (e, n) =>
                                n.celltype
                                    .replaceAll("_", " ")
                                    .split(" ")
                                    .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                    .join(" "),
                        },
                        {
                            field: "score",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Score" }) }),
                            valueGetter: (e, n) => n.score.toFixed(2),
                        },
                    ],
                    F = [
                        {
                            field: "accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Accession" }) }),
                            valueGetter: (e, n) => n.accession,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/ccre/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "gene",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Common Gene Name" }) }),
                            valueGetter: (e, n) => n.gene,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/gene/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "genetype",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Gene Type" }) }),
                            valueGetter: (e, n) =>
                                "lncRNA" === n.genetype
                                    ? n.genetype
                                    : n.genetype
                                          .replaceAll("_", " ")
                                          .split(" ")
                                          .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                          .join(" "),
                        },
                        {
                            field: "assay",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Assay Type" }) }),
                            valueGetter: (e, n) => n.assay,
                        },
                        {
                            field: "experiment_accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Experiment ID" }) }),
                            valueGetter: (e, n) => n.experiment_accession,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "https://www.encodeproject.org/experiments/".concat(e.value),
                                    openInNewTab: !0,
                                    showExternalIcon: !0,
                                    children: e.value,
                                }),
                        },
                        {
                            field: "displayname",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Biosample" }) }),
                            valueGetter: (e, n) => n.displayname,
                        },
                        {
                            field: "score",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Score" }) }),
                            valueGetter: (e, n) => n.score,
                        },
                        {
                            field: "p_val",
                            renderHeader: () =>
                                (0, a.jsx)("strong", {
                                    children: (0, a.jsx)("p", { children: (0, a.jsx)("i", { children: "P" }) }),
                                }),
                            valueGetter: (e, n) => n.p_val,
                            renderCell: (e) =>
                                (0, a.jsx)(a.Fragment, {
                                    children: 0 === e.value ? "0" : (0, d.pk)(e.value, 2, { variant: "body2" }),
                                }),
                        },
                    ],
                    G = [
                        {
                            field: "accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Accession" }) }),
                            valueGetter: (e, n) => n.accession,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/ccre/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "gene",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Common Gene Name" }) }),
                            valueGetter: (e, n) => n.gene,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/gene/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "genetype",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Gene Type" }) }),
                            valueGetter: (e, n) =>
                                "lncRNA" === n.genetype
                                    ? n.genetype
                                    : n.genetype
                                          .replaceAll("_", " ")
                                          .split(" ")
                                          .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                          .join(" "),
                        },
                        {
                            field: "variantid",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Variant ID" }) }),
                            valueGetter: (e, n) => n.variantid,
                        },
                        {
                            field: "source",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Source" }) }),
                            valueGetter: (e, n) => n.source,
                        },
                        {
                            field: "tissue",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Tissue" }) }),
                            valueGetter: (e, n) => n.tissue,
                        },
                        {
                            field: "slope",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Slope" }) }),
                            valueGetter: (e, n) => n.slope,
                        },
                        {
                            field: "p_val",
                            renderHeader: () =>
                                (0, a.jsx)("strong", {
                                    children: (0, a.jsx)("p", { children: (0, a.jsx)("i", { children: "P" }) }),
                                }),
                            valueGetter: (e, n) => n.p_val,
                            renderCell: (e) =>
                                (0, a.jsx)(a.Fragment, {
                                    children: 0 === e.value ? "0" : (0, d.pk)(e.value, 2, { variant: "body2" }),
                                }),
                        },
                    ],
                    P = [
                        {
                            field: "accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Accession" }) }),
                            valueGetter: (e, n) => n.accession,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/ccre/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "gene",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Common Gene Name" }) }),
                            valueGetter: (e, n) => n.gene,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/gene/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "genetype",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Gene Type" }) }),
                            valueGetter: (e, n) =>
                                "lncRNA" === n.genetype
                                    ? n.genetype
                                    : n.genetype
                                          .replaceAll("_", " ")
                                          .split(" ")
                                          .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                          .join(" "),
                        },
                        {
                            field: "assay",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Assay Type" }) }),
                            valueGetter: (e, n) => n.assay,
                        },
                        {
                            field: "experiment_accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Experiment ID" }) }),
                            valueGetter: (e, n) => n.experiment_accession,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "https://www.encodeproject.org/experiments/".concat(e.value),
                                    openInNewTab: !0,
                                    showExternalIcon: !0,
                                    children: e.value,
                                }),
                        },
                        {
                            field: "displayname",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Biosample" }) }),
                            valueGetter: (e, n) => n.displayname,
                        },
                        {
                            field: "effectsize",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Effect Size" }) }),
                            valueGetter: (e, n) => n.effectsize,
                        },
                        {
                            field: "p_val",
                            renderHeader: () =>
                                (0, a.jsx)("strong", {
                                    children: (0, a.jsx)("p", { children: (0, a.jsx)("i", { children: "P" }) }),
                                }),
                            valueGetter: (e, n) => n.p_val,
                            renderCell: (e) =>
                                (0, a.jsx)(a.Fragment, {
                                    children: 0 === e.value ? "0" : (0, d.pk)(e.value, 2, { variant: "body2" }),
                                }),
                        },
                    ],
                    D = [
                        {
                            field: "accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Accession" }) }),
                            valueGetter: (e, n) => n.accession,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/ccre/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "gene",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Common Gene Name" }) }),
                            valueGetter: (e, n) => n.gene,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "/GRCh38/gene/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "genetype",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Gene Type" }) }),
                            valueGetter: (e, n) =>
                                "lncRNA" === n.genetype
                                    ? n.genetype
                                    : n.genetype
                                          .replaceAll("_", " ")
                                          .split(" ")
                                          .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                          .join(" "),
                        },
                        {
                            field: "assay",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Assay Type" }) }),
                            valueGetter: (e, n) => n.assay,
                        },
                        {
                            field: "experiment_accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Experiment ID" }) }),
                            valueGetter: (e, n) => n.experiment_accession,
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, {
                                    href: "https://www.encodeproject.org/experiments/".concat(e.value),
                                    openInNewTab: !0,
                                    showExternalIcon: !0,
                                    children: e.value,
                                }),
                        },
                        {
                            field: "score",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Score" }) }),
                            valueGetter: (e, n) => n.score,
                        },
                        {
                            field: "displayname",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Biosample" }) }),
                            valueGetter: (e, n) => n.displayname,
                        },
                    ];
                return C || S || g
                    ? (0, a.jsx)(l.default, {
                          children: "Error Fetching Linked genes of cCREs against SNPs identified by a GWAS study",
                      })
                    : (0, a.jsxs)(a.Fragment, {
                          children: [
                              (0, a.jsx)(r.XIK, {
                                  showToolbar: !0,
                                  rows: T || [],
                                  columns: F,
                                  loading: f || p,
                                  label: "Intact Hi-C Loops",
                                  emptyTableFallback:
                                      "No intact Hi-C loops overlaps cCREs identified by this GWAS study",
                                  initialState: { sorting: { sortModel: [{ field: "p_val", sort: "desc" }] } },
                                  divHeight: { height: "100%", minHeight: "580px", maxHeight: "600px" },
                              }),
                              (0, a.jsx)(r.XIK, {
                                  showToolbar: !0,
                                  rows: k || [],
                                  columns: D,
                                  loading: f || p,
                                  label: "ChIA-PET Interactions",
                                  emptyTableFallback:
                                      "No ChIA-PET Interactions overlaps cCREs identified by this GWAS study",
                                  initialState: { sorting: { sortModel: [{ field: "score", sort: "asc" }] } },
                                  divHeight: { height: "100%", minHeight: "580px", maxHeight: "600px" },
                              }),
                              (0, a.jsx)(r.XIK, {
                                  showToolbar: !0,
                                  rows: _ || [],
                                  columns: P,
                                  loading: f || p,
                                  label: "CRISPRi-FlowFISH",
                                  emptyTableFallback:
                                      "No cCREs identified by this GWAS study were targeted in CRISPRi-FlowFISH experiments",
                                  initialState: { sorting: { sortModel: [{ field: "p_val", sort: "desc" }] } },
                                  divHeight: { height: "100%", minHeight: "580px", maxHeight: "600px" },
                              }),
                              (0, a.jsx)(r.XIK, {
                                  showToolbar: !0,
                                  rows: I || [],
                                  columns: G,
                                  loading: f || p,
                                  label: "eQTLs",
                                  emptyTableFallback:
                                      "No cCREs identified by this GWAS study overlap a variant associated with significant changes in gene expression",
                                  initialState: { sorting: { sortModel: [{ field: "p_val", sort: "desc" }] } },
                                  divHeight: { height: "100%", minHeight: "580px", maxHeight: "600px" },
                              }),
                              (0, a.jsxs)(a.Fragment, {
                                  children: [
                                      (0, a.jsx)(r.XIK, {
                                          showToolbar: !0,
                                          rows: y || [],
                                          columns: M,
                                          loading: b,
                                          label: "Computational Predictions",
                                          emptyTableFallback: "No Computational Predictions",
                                          initialState: { sorting: { sortModel: [{ field: "score", sort: "desc" }] } },
                                          toolbarSlot: (0, a.jsx)(s.A, {
                                              title: "Advanced Filters",
                                              children: (0, a.jsx)(i.default, {
                                                  variant: "outlined",
                                                  onClick: (e) => {
                                                      if (v) j(null);
                                                      else {
                                                          let n = e.currentTarget.getBoundingClientRect();
                                                          j({ getBoundingClientRect: () => n });
                                                      }
                                                  },
                                                  children: "Select Method",
                                              }),
                                          }),
                                          divHeight: { height: "100%", minHeight: "580px", maxHeight: "600px" },
                                      }),
                                      (0, a.jsx)(o.default, {
                                          onClick: (e) => {
                                              e.stopPropagation();
                                          },
                                          children: (0, a.jsx)(R, {
                                              method: t,
                                              open: !!v,
                                              setOpen: () => {
                                                  v && j(null);
                                              },
                                              onMethodSelect: (e) => {
                                                  h(e);
                                              },
                                          }),
                                      }),
                                  ],
                              }),
                          ],
                      });
            };
        },
        36822: (e, n, t) => {
            t.d(n, { A: () => S });
            var a = t(95155),
                r = t(50010),
                l = t(46691),
                s = t(28278),
                i = t(50301),
                o = t(24288),
                c = t(64647),
                d = t(96869),
                u = t(80357),
                h = t(80317),
                m = t(75416),
                p = t(59300),
                g = t(27001),
                x = t(94457),
                f = t(12115),
                C = t(53466),
                y = t(84389);
            let b = (e) => {
                    let { open: n, onClose: t, ref: r, plotTitle: l } = e,
                        s = [
                            { label: "PNG", action: r.downloadPNG },
                            { label: "SVG", action: r.downloadSVG },
                        ].filter((e) => e.action);
                    return (0, a.jsx)(C.A, {
                        open: n,
                        onClose: t,
                        children: (0, a.jsxs)(u.default, {
                            sx: {
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                bgcolor: "background.paper",
                                boxShadow: 24,
                                borderRadius: 2,
                                p: 3,
                                width: 360,
                            },
                            children: [
                                (0, a.jsxs)(h.default, {
                                    variant: "h6",
                                    fontWeight: 600,
                                    mb: 1,
                                    children: ["Download ", l],
                                }),
                                (0, a.jsx)(h.default, {
                                    variant: "body2",
                                    color: "text.secondary",
                                    mb: 2,
                                    children: "Choose a file format to export your plot.",
                                }),
                                (0, a.jsx)(d.default, {
                                    spacing: 1.5,
                                    divider: (0, a.jsx)(y.A, { flexItem: !0 }),
                                    children: s.map((e) =>
                                        (0, a.jsxs)(
                                            d.default,
                                            {
                                                direction: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                children: [
                                                    (0, a.jsx)(h.default, { variant: "body1", children: e.label }),
                                                    (0, a.jsx)(o.A, {
                                                        color: "primary",
                                                        onClick: e.action,
                                                        "aria-label": "Download ".concat(e.label),
                                                        children: (0, a.jsx)(g.A, {}),
                                                    }),
                                                ],
                                            },
                                            e.label
                                        )
                                    ),
                                }),
                                (0, a.jsx)(u.default, {
                                    mt: 3,
                                    textAlign: "right",
                                    children: (0, a.jsx)(c.default, { onClick: t, children: "Close" }),
                                }),
                            ],
                        }),
                    });
                },
                S = (e) => {
                    var n, t, C;
                    let { TableComponent: y, plots: S, isV40: v = !1 } = e,
                        [j, R] = (0, f.useState)(0),
                        [E, N] = (0, f.useState)(!0),
                        A = (0, f.useRef)(null),
                        [w, T] = (0, f.useState)(null),
                        [k, _] = (0, f.useState)(!1),
                        I = (0, s.A)(x.theme.breakpoints.down("sm"));
                    (0, f.useEffect)(() => {
                        if (!A.current) return;
                        let e = new ResizeObserver((e) => {
                            for (let n of e) n.contentRect && n.contentRect.height > 0 && T(n.contentRect.height);
                        });
                        return e.observe(A.current), () => e.disconnect();
                    }, []);
                    let M = () => {
                            N(!E);
                        },
                        F = (0, f.useMemo)(() => S.map((e) => ({ tabTitle: e.tabTitle, icon: e.icon })), [S]),
                        G = (0, f.useMemo)(
                            () => S.map((e) => ({ title: e.tabTitle, component: e.plotComponent })),
                            [S]
                        ),
                        P = () =>
                            (0, a.jsx)(i.A, {
                                title: "".concat(E ? "Hide" : "Show", " Table"),
                                children: (0, a.jsx)(o.A, {
                                    onClick: M,
                                    sx: { mx: -1 },
                                    children: (0, a.jsx)(r.A, { color: "primary" }),
                                }),
                            });
                    (0, f.useEffect)(() => {
                        j > S.length - 1 && R(S.length - 1);
                    }, [S, j]);
                    let D = j > S.length - 1 ? S.length - 1 : j;
                    return (0, a.jsxs)(d.default, {
                        spacing: 2,
                        direction: { xs: "column", lg: "row" },
                        id: "two-pane-layout",
                        children: [
                            (0, a.jsxs)(u.default, {
                                flexGrow: 0,
                                width: { xs: "100%", lg: E ? "35%" : "initial" },
                                id: "table-container",
                                display: E ? "initial" : "none",
                                children: [
                                    (0, a.jsxs)(d.default, {
                                        direction: "row",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 2,
                                        children: [
                                            (0, a.jsx)(P, {}),
                                            (0, a.jsx)(h.default, {
                                                variant: "h5",
                                                sx: { flexGrow: 1 },
                                                children: "Table View",
                                            }),
                                            (0, a.jsx)(i.A, {
                                                title: "".concat(E ? "Hide" : "Show", " Table"),
                                                children: (0, a.jsx)(o.A, {
                                                    onClick: M,
                                                    sx: { mx: -1 },
                                                    children: (0, a.jsx)(l.A, { color: "primary" }),
                                                }),
                                            }),
                                            (0, a.jsx)(m.A, { sx: { visibility: "hidden", minWidth: 0, px: 0 } }),
                                        ],
                                    }),
                                    (0, a.jsx)("div", { ref: A, style: { height: "60vh" }, children: y }),
                                ],
                            }),
                            (0, a.jsxs)(u.default, {
                                flex: "1 1 0",
                                minWidth: 0,
                                id: "tabs_figure_container",
                                children: [
                                    (0, a.jsxs)(d.default, {
                                        direction: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        children: [
                                            (0, a.jsxs)(d.default, {
                                                direction: "row",
                                                alignItems: "center",
                                                mb: 2,
                                                gap: 2,
                                                children: [
                                                    !E && (0, a.jsx)(P, {}),
                                                    (0, a.jsx)(p.A, {
                                                        value: D,
                                                        onChange: (e, n) => {
                                                            R(n);
                                                        },
                                                        id: "plot_tabs",
                                                        children: F.map((e, n) =>
                                                            (0, a.jsx)(
                                                                m.A,
                                                                {
                                                                    label: I ? "" : e.tabTitle,
                                                                    icon: e.icon,
                                                                    iconPosition: "start",
                                                                    sx: { minHeight: "48px" },
                                                                    disabled: v,
                                                                },
                                                                n
                                                            )
                                                        ),
                                                    }),
                                                ],
                                            }),
                                            (0, a.jsx)(() => {
                                                let e = () => {
                                                    _(!0);
                                                };
                                                return I
                                                    ? (0, a.jsx)(o.A, {
                                                          color: "primary",
                                                          "aria-label": "download",
                                                          size: "small",
                                                          onClick: e,
                                                          disabled: v,
                                                          children: (0, a.jsx)(g.A, {}),
                                                      })
                                                    : (0, a.jsx)(c.default, {
                                                          variant: "outlined",
                                                          startIcon: (0, a.jsx)(g.A, {}),
                                                          onClick: e,
                                                          disabled: v,
                                                          children: "Download",
                                                      });
                                            }, {}),
                                        ],
                                    }),
                                    G.map((e, n) =>
                                        (0, a.jsx)(
                                            u.default,
                                            {
                                                display: D === n ? "block" : "none",
                                                id: "figure_container",
                                                height: E ? w : "UMAP" === e.title ? "700px" : "100%",
                                                maxHeight: "Bar Plot" !== e.title ? "700px" : "none",
                                                minHeight: "580px",
                                                children: e.component,
                                            },
                                            n
                                        )
                                    ),
                                    k &&
                                        (0, a.jsx)(b, {
                                            open: k,
                                            onClose: () => _(!1),
                                            ref: null == (t = S[D]) || null == (n = t.ref) ? void 0 : n.current,
                                            plotTitle: null == (C = S[D]) ? void 0 : C.tabTitle,
                                        }),
                                ],
                            }),
                        ],
                    });
                };
        },
        37969: (e, n, t) => {
            t.d(n, { default: () => y });
            var a = t(95155),
                r = t(12434),
                l = t(50301),
                s = t(96869),
                i = t(80317),
                o = t(83982),
                c = t(51760),
                d = t(82293),
                u = t(44945),
                h = t(12115),
                m = t(80357),
                p = t(66800);
            let g = (e) => "".concat(e, "kb"),
                x = [
                    { value: 0, label: "0kb" },
                    { value: 500, label: "0.5kb" },
                    { value: 1e3, label: "1kb" },
                    { value: 1500, label: "1.5kb" },
                    { value: 2e3, label: "2kb" },
                ],
                f = (e) => {
                    let { distance: n, handleDistanceChange: t } = e;
                    return (0, a.jsx)(m.default, {
                        sx: { width: "200px", mr: 2 },
                        children: (0, a.jsx)(p.Ay, {
                            "aria-label": "Distance slider",
                            defaultValue: 500,
                            getAriaValueText: g,
                            min: 0,
                            max: 2e3,
                            step: null,
                            value: n,
                            onChange: (e, n) => t(n),
                            marks: x,
                        }),
                    });
                };
            var C = t(1684);
            let y = (e) => {
                let { entity: n } = e,
                    { data: t, loading: m, error: p } = (0, u.P)({ rsID: n.entityID, assembly: n.assembly }),
                    [g, x] = (0, h.useState)(500),
                    y = (e) => {
                        x(e);
                    },
                    b = (0, h.useMemo)(() => {
                        if (!(null == t ? void 0 : t.coordinates)) return null;
                        let { chromosome: e, start: n, end: a } = t.coordinates;
                        return { chromosome: e, start: n - g, end: a + g };
                    }, [t, g]),
                    { data: S, loading: v, error: j } = (0, d.H)({ coordinates: b, assembly: "GRCh38", skip: !b }),
                    R =
                        null == S
                            ? void 0
                            : S.map((e) => ({
                                  ccre: null == e ? void 0 : e.info.accession,
                                  chromosome: null == e ? void 0 : e.chrom,
                                  start: null == e ? void 0 : e.start,
                                  end: (null == e ? void 0 : e.start) + (null == e ? void 0 : e.len),
                                  group: null == e ? void 0 : e.pct,
                                  distance: (0, C.po)(
                                      { start: b.start, end: b.end },
                                      {
                                          start: null == e ? void 0 : e.start,
                                          end: (null == e ? void 0 : e.start) + (null == e ? void 0 : e.len),
                                      }
                                  ),
                              })),
                    E = [
                        {
                            field: "ccre",
                            headerName: "Accession",
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, { href: "/GRCh38/ccre/".concat(e.value), children: e.value }),
                        },
                        {
                            field: "group",
                            headerName: "Class",
                            renderCell: (e) =>
                                (0, a.jsx)(l.A, {
                                    title: (0, a.jsxs)("div", {
                                        children: [
                                            "See",
                                            " ",
                                            (0, a.jsx)(c.g, {
                                                openInNewTab: !0,
                                                color: "inherit",
                                                showExternalIcon: !0,
                                                href: "https://screen.wenglab.org/about#classifications",
                                                children: "SCREEN",
                                            }),
                                            " ",
                                            "for Class definitions",
                                        ],
                                    }),
                                    children: (0, a.jsx)("span", { children: e.value }),
                                }),
                        },
                        { field: "chromosome", headerName: "Chromosome" },
                        {
                            field: "start",
                            headerName: "Start",
                            type: "number",
                            valueFormatter: (e) => (null == e ? "" : e.toLocaleString()),
                        },
                        {
                            field: "end",
                            headerName: "End",
                            type: "number",
                            valueFormatter: (e) => (null == e ? "" : e.toLocaleString()),
                        },
                        {
                            field: "distance",
                            headerName: "Distance",
                            renderHeader: () =>
                                (0, a.jsxs)(a.Fragment, {
                                    children: ["Distance from\xa0", (0, a.jsx)("i", { children: n.entityID })],
                                }),
                            type: "number",
                            renderCell: (e) => {
                                let { value: n } = e;
                                if (null == n) return "";
                                let t = Math.abs(n);
                                return (0, a.jsx)("span", {
                                    children: "".concat(0 === n ? "" : n < 0 ? "-" : "+").concat(t.toLocaleString()),
                                });
                            },
                            sortComparator: (e, n) => Math.abs(e) - Math.abs(n),
                        },
                    ];
                return (0, a.jsx)(o.XIK, {
                    rows: R,
                    columns: E,
                    label: "Nearby cCREs",
                    loading: m || v,
                    error: !!(j || p),
                    initialState: { sorting: { sortModel: [{ field: "distance", sort: "asc" }] } },
                    emptyTableFallback: (0, a.jsxs)(s.default, {
                        direction: "row",
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        p: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        children: [
                            (0, a.jsxs)(s.default, {
                                direction: "row",
                                spacing: 1,
                                children: [
                                    (0, a.jsx)(r.A, {}),
                                    (0, a.jsxs)(i.default, {
                                        children: ["No Nearby cCREs Found Within ", g, "bp of ", n.entityID],
                                    }),
                                ],
                            }),
                            (0, a.jsx)(f, { distance: g, handleDistanceChange: y }),
                        ],
                    }),
                    divHeight: { maxHeight: "600px" },
                    toolbarSlot: (0, a.jsx)(f, { distance: g, handleDistanceChange: y }),
                    labelTooltip: (0, a.jsxs)(i.default, {
                        component: "span",
                        variant: "subtitle2",
                        children: ["(Within ", g, "bp of ", n.entityID, ")"],
                    }),
                });
            };
        },
        38083: (e, n, t) => {
            t.d(n, { A: () => s });
            var a = t(95155),
                r = t(96869),
                l = t(83982);
            function s(e) {
                let { tables: n } = e;
                return (0, a.jsx)(r.default, {
                    spacing: 2,
                    children: n.map((e, n) =>
                        (0, a.jsx)(
                            l.XIK,
                            {
                                initialState: {
                                    sorting: { sortModel: [{ field: e.sortColumn, sort: e.sortDirection }] },
                                },
                                ...e,
                                divHeight: { height: "400px" },
                            },
                            n
                        )
                    ),
                });
            }
        },
        41189: (e, n, t) => {
            t.d(n, { Gp: () => d, K1: () => u, Nr: () => h, uo: () => o });
            var a = t(12115),
                r = t(40650),
                l = t(78224),
                s = t(90298);
            let i = (0, l.J)(
                    "\n  query BigRequests($bigRequests: [BigRequest!]!) {\n    bigRequests(requests: $bigRequests) {\n      data\n      error {\n        errortype\n        message\n      }\n    }\n  }\n"
                ),
                o = [
                    "TssFlnk",
                    "TssFlnkD",
                    "TssFlnkU",
                    "Tss",
                    "Enh1",
                    "Enh2",
                    "EnhG1",
                    "EnhG2",
                    "TxWk",
                    "Biv",
                    "ReprPC",
                    "Quies",
                    "Het",
                    "ZNF/Rpts",
                    "Tx",
                ],
                c = {
                    TssFlnk: { description: "Flanking TSS", stateno: "E1", color: "#FF4500" },
                    TssFlnkD: { description: "Flanking TSS downstream", stateno: "E2", color: "#FF4500" },
                    TssFlnkU: { description: "Flanking TSS upstream", stateno: "E3", color: "#FF4500" },
                    Tss: { description: "Active TSS", stateno: "E4", color: "#FF0000" },
                    Enh1: { description: "Enhancer", stateno: "E5", color: "#FFDF00" },
                    Enh2: { description: "Enhancer", stateno: "E6", color: "#FFDF00" },
                    EnhG1: { description: "Enhancer in gene", stateno: "E7", color: "#AADF07" },
                    EnhG2: { description: "Enhancer in gene", stateno: "E8", color: "#AADF07" },
                    TxWk: { description: "Weak transcription", stateno: "E9", color: "#3F9A50" },
                    Biv: { description: "Bivalent", stateno: "E10", color: "#CD5C5C" },
                    ReprPC: { description: "Repressed by Polycomb", stateno: "E11", color: "#8937DF" },
                    Quies: { description: "Quiescent", stateno: "E12", color: "#DCDCDC" },
                    Het: { description: "Heterochromatin", stateno: "E13", color: "#4B0082" },
                    "ZNF/Rpts": { description: "ZNF genes repeats", stateno: "E14", color: "#68cdaa" },
                    Tx: { description: "Transcription", stateno: "E15", color: "#008000" },
                };
            function d(e) {
                return c[e].description + " (" + c[e].stateno + ")";
            }
            let u = [
                "adipose",
                "adrenal gland",
                "blood",
                "blood vessel",
                "bone",
                "bone marrow",
                "brain",
                "breast",
                "connective tissue",
                "embryo",
                "esophagus",
                "heart",
                "large intestine",
                "liver",
                "lung",
                "muscle",
                "nerve",
                "ovary",
                "pancreas",
                "paraythroid gland",
                "penis",
                "placenta",
                "prostate",
                "skin",
                "small intestine",
                "spleen",
                "stomach",
                "testis",
                "thymus",
                "thyroid",
                "uterus",
                "vagina",
            ];
            function h(e) {
                let n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "GRCh38",
                    [t, l] = (0, a.useState)(null),
                    [s, o] = (0, a.useState)(null),
                    [c, d] = (0, a.useState)(!0),
                    [u, h] = (0, a.useState)(!1);
                (0, a.useEffect)(() => {
                    (async () => {
                        try {
                            if ((d(!0), "GRCh38" !== n)) {
                                l(null), o(null), d(!1);
                                return;
                            }
                            let e = await m();
                            l(e);
                            let t = Object.keys(e)
                                .map((n) => e[n].map((e) => ({ tissue: n, url: e.url, biosample: e.displayName })))
                                .flat();
                            o(t);
                        } catch (e) {
                            console.error("Error fetching ChromHMM data:", e), h(!0);
                        } finally {
                            d(!1);
                        }
                    })();
                }, [n]);
                let {
                    data: p,
                    loading: g,
                    error: x,
                } = (0, r.IT)(i, {
                    variables: {
                        bigRequests:
                            (null == s
                                ? void 0
                                : s.map((n) => ({
                                      chr1: e.chromosome,
                                      start: e.start,
                                      end: e.end,
                                      preRenderedWidth: 1400,
                                      url: n.url,
                                  }))) || [],
                    },
                    skip: !s || "GRCh38" !== n,
                });
                return {
                    tracks: t,
                    processedTableData: (0, a.useMemo)(() => {
                        if (p && s && !g)
                            return p.bigRequests.map((e, n) => {
                                let t = e.data[0];
                                return {
                                    start: t.start,
                                    end: t.end,
                                    state: t.name,
                                    chr: t.chr,
                                    color: t.color,
                                    tissue: s[n].tissue,
                                    biosample: s[n].biosample,
                                };
                            });
                    }, [p, s, g]),
                    loading: c || g,
                    error: u || x,
                };
            }
            async function m() {
                let e = await fetch(s.o.l),
                    n = await e.text(),
                    t = {};
                return (
                    n.split("\n").forEach((e) => {
                        let [n, a, r, l] = e.split("	");
                        if (!r) return;
                        let s = {
                            sample: n,
                            displayName: l,
                            url: "https://downloads.wenglab.org/ChIP_".concat(a, ".bigBed"),
                        };
                        t[r] ? t[r].push(s) : (t[r] = [s]);
                    }),
                    t
                );
            }
        },
        44396: (e, n, t) => {
            t.d(n, { default: () => M });
            var a = t(95155),
                r = t(78062),
                l = t(58552),
                s = t(36822),
                i = t(40650),
                o = t(12115);
            let c = (0, t(78224).J)(
                "\n  query tssRampage($gene: String!) {\n  tssrampageQuery(genename: $gene) {\n    start    \n    organ   \n    strand\n    peakId\n    biosampleName\n    biosampleType\n    biosampleSummary\n    peakType\n    expAccession\n    value\n    start\n    end \n    chrom    \n    genes {\n      geneName\n        locusType\n    }\n  }\n}"
            );
            var d = t(25789),
                u = t(28278),
                h = t(50301),
                m = t(24288),
                p = t(80317),
                g = t(62995),
                x = t(51404),
                f = t(23405),
                C = t(83982),
                y = t(88816),
                b = t(1684),
                S = t(79194);
            let v = (e) => {
                let {
                        selected: n,
                        setSelected: t,
                        transcriptExpressionData: r,
                        setSortedFilteredData: l,
                        sortedFilteredData: s,
                        selectedPeak: i,
                        setPeak: c,
                        viewBy: v,
                        rows: j,
                        scale: R,
                        ...E
                    } = e,
                    [N, A] = (0, o.useState)(!1),
                    { data: w, loading: T, error: k } = r,
                    _ = (0, d.default)(),
                    I = (0, u.A)(_.breakpoints.down("sm")),
                    M = (0, o.useMemo)(() => {
                        if (!j.length) return [];
                        let e = j;
                        switch (v) {
                            case "value":
                                e.sort((e, n) => n.value - e.value);
                                break;
                            case "tissue": {
                                let n = (e) => {
                                        var n;
                                        return null != (n = e.organ) ? n : "unknown";
                                    },
                                    t = e.reduce((e, t) => {
                                        var a;
                                        let r = n(t);
                                        return (e[r] = Math.max(null != (a = e[r]) ? a : -1 / 0, t.value)), e;
                                    }, {});
                                e.sort((e, a) => {
                                    let r = n(e),
                                        l = t[n(a)] - t[r];
                                    return 0 !== l ? l : a.value - e.value;
                                });
                                break;
                            }
                            case "tissueMax": {
                                let n = (e) => {
                                        var n;
                                        return null != (n = e.organ) ? n : "unknown";
                                    },
                                    t = e.reduce((e, t) => {
                                        var a;
                                        let r = n(t);
                                        return (e[r] = Math.max(null != (a = e[r]) ? a : -1 / 0, t.value)), e;
                                    }, {});
                                (e = e.filter((e) => {
                                    let a = n(e);
                                    return e.value === t[a];
                                })).sort((e, n) => n.value - e.value);
                            }
                        }
                        return [...e];
                    }, [j, v]),
                    F = [
                        {
                            ...C.fgx,
                            sortable: !0,
                            hideable: !1,
                            renderHeader: (e) =>
                                (0, a.jsx)("div", {
                                    id: "StopPropagationWrapper",
                                    onClick: (e) => e.stopPropagation(),
                                    children: (0, a.jsx)(C.fgx.renderHeader, { ...e }),
                                }),
                        },
                        {
                            field: "biosample",
                            headerName: "Sample",
                            sortable: "tissue" !== v,
                            valueGetter: (e, n) => (0, b.Zr)(n.biosampleSummary.replaceAll("_", " ")),
                            renderCell: (e) =>
                                (0, a.jsx)("div", {
                                    style: {
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: 250,
                                    },
                                    title: e.value,
                                    children: e.value,
                                }),
                        },
                        {
                            field: " ",
                            headerName: "".concat("linear" === R ? "RPM" : "Log10(RPM + 1)"),
                            type: "number",
                            sortable: "tissue" !== v,
                            valueGetter: (e, n) => n.value.toFixed(2),
                        },
                        {
                            field: "organ",
                            headerName: "Tissue",
                            sortable: "tissue" !== v,
                            valueGetter: (e, n) => (0, b.Zr)(n.organ),
                        },
                        { field: "strand", headerName: "Strand", sortable: "tissue" !== v },
                        {
                            field: "expAccession",
                            headerName: "Experiment",
                            sortable: "tissue" !== v,
                            renderCell: (e) =>
                                (0, a.jsx)(h.A, {
                                    title: "View Experiment in ENCODE",
                                    arrow: !0,
                                    children: (0, a.jsx)(m.A, {
                                        href: "https://www.encodeproject.org/experiments/".concat(e.value),
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        size: "small",
                                        children: (0, a.jsx)(y.A, { fontSize: "inherit" }),
                                    }),
                                }),
                        },
                    ],
                    G = (0, C.bBi)(),
                    P = (0, o.useMemo)(() => (0, a.jsx)(S.A, { autoSort: N, setAutoSort: A }), [N]),
                    D = (0, o.useMemo)(() => [{ field: "rpm", sort: "desc" }], []);
                return (
                    (0, o.useEffect)(() => {
                        let e = null == G ? void 0 : G.current;
                        if (!e) return;
                        let t = (null == n ? void 0 : n.length) > 0;
                        return "tissue" === v
                            ? void (N && t
                                  ? e.setSortModel([{ field: "__check__", sort: "desc" }])
                                  : e.setSortModel([]))
                            : N
                              ? void e.setSortModel(t ? [{ field: "__check__", sort: "desc" }] : D)
                              : void e.setSortModel(D);
                    }, [G, N, D, n, v]),
                    (0, a.jsx)(a.Fragment, {
                        children: (0, a.jsx)(C.XIK, {
                            apiRef: G,
                            label: (0, a.jsxs)(a.Fragment, {
                                children: [
                                    (0, a.jsx)(p.default, {
                                        mr: 1,
                                        display: { xs: "none", md: "inherit" },
                                        children: "TSS Expression at",
                                    }),
                                    (0, a.jsx)(g.A, {
                                        children: (0, a.jsx)(x.A, {
                                            value: i,
                                            onChange: (e) => c(e.target.value),
                                            size: "small",
                                            variant: "standard",
                                            renderValue: (e) => {
                                                var n;
                                                return (
                                                    (null == r || null == (n = r.peaks.find((n) => n.peakID === e))
                                                        ? void 0
                                                        : n.peakID) || ""
                                                );
                                            },
                                            children:
                                                null == r
                                                    ? void 0
                                                    : r.peaks.map((e) =>
                                                          (0, a.jsx)(
                                                              f.A,
                                                              {
                                                                  value: e.peakID,
                                                                  children: ""
                                                                      .concat(e.peakID, " (")
                                                                      .concat(e.peakType, ")"),
                                                              },
                                                              e.peakID
                                                          )
                                                      ),
                                        }),
                                    }),
                                ],
                            }),
                            rows: M,
                            columns: F,
                            loading: T,
                            pageSizeOptions: [10, 25, 50],
                            initialState: { sorting: { sortModel: D } },
                            downloadFileName: "TSS Expression at " + i,
                            checkboxSelection: !0,
                            getRowId: (e) => e.expAccession,
                            onRowSelectionModelChange: (e) => {
                                "include" === e.type
                                    ? t(Array.from(e.ids).map((e) => j.find((n) => n.expAccession === e)))
                                    : t(j);
                            },
                            rowSelectionModel: { type: "include", ids: new Set(n.map((e) => e.expAccession)) },
                            keepNonExistentRowsSelected: !0,
                            onStateChange: () => {
                                let e = (0, C.oU)(G).map((e) => e.model);
                                ((e, n) => {
                                    if (e.length !== n.length || JSON.stringify(e[0]) !== JSON.stringify(n[0]))
                                        return !1;
                                    for (let t = 0; t < e.length; t++)
                                        if (e[t].expAccession !== n[t].expAccession) return !1;
                                    return !0;
                                })(s, e) || l(e);
                            },
                            divHeight: { height: "100%", minHeight: I ? "none" : "580px" },
                            toolbarSlot: P,
                        }),
                    })
                );
            };
            var j = t(80357),
                R = t(94434),
                E = t(93320),
                N = t(96869),
                A = t(22585),
                w = t(71583),
                T = t(35497);
            let k = (e) => {
                    let {
                        selectedPeak: n,
                        setPeak: t,
                        transcriptExpressionData: r,
                        scale: l,
                        setScale: s,
                        viewBy: i,
                        setViewBy: o,
                        setSortBy: c = () => {},
                        sortBy: d = "median",
                        violin: u = !1,
                        setShowPoints: h = () => {},
                        showPoints: m = !0,
                    } = e;
                    return (0, a.jsxs)(N.default, {
                        direction: "row",
                        spacing: 2,
                        alignItems: "center",
                        mb: 2,
                        flexWrap: "wrap",
                        children: [
                            (0, a.jsxs)(g.A, {
                                children: [
                                    (0, a.jsx)(A.A, { children: "Peak" }),
                                    (0, a.jsx)(x.A, {
                                        value: n,
                                        onChange: (e) => t(e.target.value),
                                        size: "small",
                                        renderValue: (e) => {
                                            var n;
                                            return (
                                                (null == r || null == (n = r.peaks.find((n) => n.peakID === e))
                                                    ? void 0
                                                    : n.peakID) || ""
                                            );
                                        },
                                        children:
                                            null == r
                                                ? void 0
                                                : r.peaks.map((e) =>
                                                      (0, a.jsx)(
                                                          f.A,
                                                          {
                                                              value: e.peakID,
                                                              children: ""
                                                                  .concat(e.peakID, " (")
                                                                  .concat(e.peakType, ")"),
                                                          },
                                                          e.peakID
                                                      )
                                                  ),
                                    }),
                                ],
                            }),
                            (0, a.jsxs)(g.A, {
                                children: [
                                    (0, a.jsx)(A.A, { children: "Scale" }),
                                    (0, a.jsxs)(w.A, {
                                        color: "primary",
                                        value: l,
                                        exclusive: !0,
                                        onChange: (e, n) => {
                                            null !== n && s(n);
                                        },
                                        "aria-label": "View By",
                                        size: "small",
                                        children: [
                                            (0, a.jsx)(T.A, {
                                                sx: { textTransform: "none" },
                                                value: "linear",
                                                children: "Linear",
                                            }),
                                            (0, a.jsx)(T.A, {
                                                sx: { textTransform: "none" },
                                                value: "log",
                                                children: "Log",
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            !u &&
                                (0, a.jsxs)(g.A, {
                                    children: [
                                        (0, a.jsx)(A.A, { children: "View By" }),
                                        (0, a.jsxs)(w.A, {
                                            color: "primary",
                                            value: i,
                                            exclusive: !0,
                                            onChange: (e, n) => {
                                                null !== n && o(n);
                                            },
                                            "aria-label": "View By",
                                            size: "small",
                                            children: [
                                                (0, a.jsx)(T.A, {
                                                    sx: { textTransform: "none" },
                                                    value: "value",
                                                    children: "Value",
                                                }),
                                                (0, a.jsx)(T.A, {
                                                    sx: { textTransform: "none" },
                                                    value: "tissue",
                                                    children: "Tissue",
                                                }),
                                                (0, a.jsx)(T.A, {
                                                    sx: { textTransform: "none" },
                                                    value: "tissueMax",
                                                    children: "Tissue Max",
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            u &&
                                (0, a.jsxs)(N.default, {
                                    direction: "row",
                                    spacing: 2,
                                    alignItems: "center",
                                    children: [
                                        (0, a.jsxs)(g.A, {
                                            children: [
                                                (0, a.jsx)(A.A, { children: "Sort By" }),
                                                (0, a.jsxs)(w.A, {
                                                    color: "primary",
                                                    value: d,
                                                    exclusive: !0,
                                                    onChange: (e, n) => {
                                                        null !== n && c(n);
                                                    },
                                                    "aria-label": "View By",
                                                    size: "small",
                                                    children: [
                                                        (0, a.jsx)(T.A, {
                                                            sx: { textTransform: "none" },
                                                            value: "max",
                                                            children: "Max",
                                                        }),
                                                        (0, a.jsx)(T.A, {
                                                            sx: { textTransform: "none" },
                                                            value: "median",
                                                            children: "Median",
                                                        }),
                                                        (0, a.jsx)(T.A, {
                                                            sx: { textTransform: "none" },
                                                            value: "tissue",
                                                            children: "Tissue",
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                        (0, a.jsxs)(g.A, {
                                            children: [
                                                (0, a.jsx)(A.A, { children: "Show Points" }),
                                                (0, a.jsxs)(w.A, {
                                                    color: "primary",
                                                    value: m,
                                                    exclusive: !0,
                                                    onChange: (e, n) => {
                                                        null !== n && h(n);
                                                    },
                                                    "aria-label": "show points",
                                                    size: "small",
                                                    children: [
                                                        (0, a.jsx)(T.A, {
                                                            sx: { textTransform: "none" },
                                                            value: !0,
                                                            children: "On",
                                                        }),
                                                        (0, a.jsx)(T.A, {
                                                            sx: { textTransform: "none" },
                                                            value: !1,
                                                            children: "Off",
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                        ],
                    });
                },
                _ = (e) => {
                    let {
                            setPeak: n,
                            setViewBy: t,
                            setScale: r,
                            scale: l,
                            viewBy: s,
                            entity: i,
                            transcriptExpressionData: c,
                            selected: d,
                            setSelected: u,
                            selectedPeak: h,
                            sortedFilteredData: m,
                            ref: g,
                            ...x
                        } = e,
                        f = (0, o.useMemo)(
                            () =>
                                m
                                    ? m.map((e, n) => {
                                          var t;
                                          let a = d.length > 0,
                                              r = d.some((n) => n.expAccession === e.expAccession);
                                          return {
                                              category: (0, b.kR)(e.organ),
                                              label: (0, b.Zr)((0, b.W5)(e.biosampleSummary, 20)),
                                              value: e.value,
                                              color:
                                                  (a && r) || !a
                                                      ? null != (t = R.Me[e.organ])
                                                          ? t
                                                          : R.Me.missing
                                                      : "#CCCCCC",
                                              metadata: e,
                                              id: n.toString(),
                                          };
                                      })
                                    : [],
                            [m, d]
                        );
                    return (0, a.jsxs)(j.default, {
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                        padding: 1,
                        sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" },
                        children: [
                            (0, a.jsx)(k, {
                                setViewBy: t,
                                setPeak: n,
                                setScale: r,
                                scale: l,
                                viewBy: s,
                                transcriptExpressionData: c,
                                selectedPeak: h,
                            }),
                            (0, a.jsx)(E.bH, {
                                onBarClicked: (e) => {
                                    d.some((n) => n.expAccession === e.metadata.expAccession)
                                        ? u(d.filter((n) => n.expAccession !== e.metadata.expAccession))
                                        : u([...d, e.metadata]);
                                },
                                data: f,
                                topAxisLabel: "TSS Expression at "
                                    .concat(h, " of ")
                                    .concat(i.entityID, " - ")
                                    .concat("log" === l ? "log₁₀(RPM + 1)" : "RPM"),
                                TooltipContents: (e) =>
                                    (0, a.jsxs)(a.Fragment, {
                                        children: [
                                            (0, a.jsxs)(p.default, {
                                                variant: "body2",
                                                children: [
                                                    (0, a.jsx)("b", { children: "Sample:" }),
                                                    " ",
                                                    (0, b.kR)(e.metadata.biosampleSummary.replaceAll("_", " ")),
                                                ],
                                            }),
                                            (0, a.jsxs)(p.default, {
                                                variant: "body2",
                                                children: [
                                                    (0, a.jsx)("b", { children: "Tissue:" }),
                                                    " ",
                                                    (0, b.kR)(e.metadata.organ),
                                                ],
                                            }),
                                            (0, a.jsxs)(p.default, {
                                                variant: "body2",
                                                children: [
                                                    (0, a.jsx)("b", { children: "Strand:" }),
                                                    " ",
                                                    (0, b.kR)(e.metadata.strand),
                                                ],
                                            }),
                                            (0, a.jsxs)(p.default, {
                                                variant: "body2",
                                                children: [
                                                    (0, a.jsx)("b", { children: "RPM:" }),
                                                    " ",
                                                    e.value.toFixed(2),
                                                ],
                                            }),
                                        ],
                                    }),
                                ref: g,
                                downloadFileName: "".concat(i.entityID, "_TSS_bar_plot"),
                            }),
                        ],
                    });
                },
                I = (e) => {
                    let {
                            setViewBy: n,
                            setPeak: t,
                            setScale: r,
                            setSelected: l,
                            scale: s,
                            viewBy: i,
                            entity: c,
                            selectedPeak: d,
                            transcriptExpressionData: u,
                            selected: h,
                            rows: m,
                            ref: p,
                            ...g
                        } = e,
                        [x, f] = (0, o.useState)("max"),
                        [C, y] = (0, o.useState)(!0),
                        b = (0, o.useMemo)(() => {
                            if (!m) return [];
                            let e = Object.entries(
                                m.reduce((e, n) => {
                                    let t = n.organ;
                                    return e[t] || (e[t] = []), e[t].push(n), e;
                                }, {})
                            ).map((e) => {
                                var n;
                                let [t, a] = e,
                                    r = a.map((e) => e.value),
                                    l =
                                        0 === h.length ||
                                        a.every((e) => h.some((n) => n.expAccession === e.expAccession))
                                            ? null != (n = R.Me[t])
                                                ? n
                                                : R.Me.missing
                                            : "#CCCCCC";
                                return {
                                    label: t,
                                    data: r.map((e, n) => {
                                        var l;
                                        let s = a[n],
                                            i = 0 === h.length || h.some((e) => e.expAccession === s.expAccession),
                                            o = i ? (null != (l = R.Me[t]) ? l : R.Me.missing) : "#CCCCCC",
                                            c = i ? 4 : 2;
                                        return r.length < 3
                                            ? { value: e, radius: c, tissue: t, metadata: s, color: o }
                                            : {
                                                  value: e,
                                                  radius: 0 === h.length ? 2 : c,
                                                  tissue: t,
                                                  metadata: s,
                                                  color: o,
                                              };
                                    }),
                                    violinColor: l,
                                };
                            });
                            return (
                                e.sort((e, n) => {
                                    if ("tissue" === x) return e.label.localeCompare(n.label);
                                    if ("median" === x) {
                                        let t = (e) => {
                                            let n = [...e].sort((e, n) => e - n),
                                                t = Math.floor(n.length / 2);
                                            return n.length % 2 != 0 ? n[t] : (n[t - 1] + n[t]) / 2;
                                        };
                                        return t(n.data.map((e) => e.value)) - t(e.data.map((e) => e.value));
                                    }
                                    return "max" === x
                                        ? Math.max(...n.data.map((e) => e.value)) -
                                              Math.max(...e.data.map((e) => e.value))
                                        : 0;
                                }),
                                e
                            );
                        }, [h, m, x]);
                    return (0, a.jsxs)(j.default, {
                        width: "100%",
                        height: "100%",
                        padding: 1,
                        sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" },
                        children: [
                            (0, a.jsx)(k, {
                                setViewBy: n,
                                setPeak: t,
                                setScale: r,
                                setSortBy: f,
                                setShowPoints: y,
                                showPoints: C,
                                scale: s,
                                viewBy: i,
                                sortBy: x,
                                transcriptExpressionData: u,
                                selectedPeak: d,
                                violin: !0,
                            }),
                            (0, a.jsx)(j.default, {
                                width: "100%",
                                height: "calc(100% - 63px)",
                                children: (0, a.jsx)(E.Dq, {
                                    ...g,
                                    distributions: b,
                                    axisLabel: "TSS Expression at "
                                        .concat(d, " of ")
                                        .concat(c.entityID, " (")
                                        .concat("log" === s ? "log₁₀RPM" : "RPM", ")"),
                                    loading: u.loading,
                                    labelOrientation: "leftDiagonal",
                                    onViolinClicked: (e) => {
                                        let n = e.data.map((e) => e.metadata);
                                        if (n.every((e) => h.some((n) => n.expAccession === e.expAccession)))
                                            l(h.filter((e) => !n.some((n) => n.expAccession === e.expAccession)));
                                        else {
                                            let e = n.filter((e) => !h.some((n) => n.expAccession === e.expAccession));
                                            l([...h, ...e]);
                                        }
                                    },
                                    onPointClicked: (e) => {
                                        let n = e.metadata.expAccession;
                                        h.some((e) => e.expAccession === n)
                                            ? l(h.filter((e) => e.expAccession !== n))
                                            : l([...h, e.metadata]);
                                    },
                                    violinProps: { bandwidth: "scott", showAllPoints: C, jitter: 10 },
                                    crossProps: { outliers: C ? "all" : "none" },
                                    ref: p,
                                    downloadFileName: "".concat(c.entityID, "_TSS_violin_plot"),
                                    pointTooltipBody: (e) => {
                                        var n, t, r, l;
                                        return (0, a.jsxs)(j.default, {
                                            maxWidth: 300,
                                            children: [
                                                e.outlier &&
                                                    (0, a.jsx)("div", {
                                                        children: (0, a.jsx)("strong", { children: "Outlier" }),
                                                    }),
                                                (0, a.jsxs)("div", {
                                                    children: [
                                                        (0, a.jsx)("strong", { children: "Sample:" }),
                                                        " ",
                                                        null == (n = e.metadata) ? void 0 : n.biosampleName,
                                                    ],
                                                }),
                                                (0, a.jsxs)("div", {
                                                    children: [
                                                        (0, a.jsx)("strong", { children: "Tissue:" }),
                                                        " ",
                                                        null == (t = e.metadata) ? void 0 : t.organ,
                                                    ],
                                                }),
                                                (0, a.jsxs)("div", {
                                                    children: [
                                                        (0, a.jsx)("strong", { children: "Strand:" }),
                                                        " ",
                                                        null == (r = e.metadata) ? void 0 : r.strand,
                                                    ],
                                                }),
                                                (0, a.jsxs)("div", {
                                                    children: [
                                                        (0, a.jsx)("strong", { children: "RPM:" }),
                                                        " ",
                                                        null == (l = e.metadata) ? void 0 : l.value.toFixed(2),
                                                    ],
                                                }),
                                            ],
                                        });
                                    },
                                }),
                            }),
                        ],
                    });
                },
                M = (e) => {
                    let { entity: n } = e,
                        [t, d] = (0, o.useState)([]),
                        [u, h] = (0, o.useState)(""),
                        [m, p] = (0, o.useState)("value"),
                        [g, x] = (0, o.useState)("linear"),
                        [f, C] = (0, o.useState)([]),
                        y = (0, o.useRef)(null),
                        b = (0, o.useRef)(null),
                        S = ((e) => {
                            var n;
                            let { gene: t } = e,
                                { data: a, loading: r, error: l } = (0, i.IT)(c, { variables: { gene: t }, skip: !t }),
                                s = (0, o.useMemo)(
                                    () =>
                                        (null == a ? void 0 : a.tssrampageQuery)
                                            ? Array.from(
                                                  new Map(
                                                      null == a
                                                          ? void 0
                                                          : a.tssrampageQuery.map((e) => [
                                                                e.peakId,
                                                                {
                                                                    peakID: e.peakId,
                                                                    peakType: e.peakType,
                                                                    locusType: e.genes[0].locusType,
                                                                    coordinates: {
                                                                        chrom: e.chrom,
                                                                        start: e.start,
                                                                        end: e.end,
                                                                    },
                                                                },
                                                            ])
                                                  ).values()
                                              )
                                            : [],
                                    [a]
                                );
                            return {
                                data: null != (n = null == a ? void 0 : a.tssrampageQuery) ? n : [],
                                peaks: s,
                                loading: r,
                                error: l,
                            };
                        })({ gene: n.entityID });
                    (0, o.useEffect)(() => {
                        if (S && "" === u) {
                            var e, n, t;
                            h(null != (t = null == (n = S.data) || null == (e = n[0]) ? void 0 : e.peakId) ? t : "");
                        }
                    }, [u, S]);
                    let j = (0, o.useMemo)(() => {
                            var e;
                            if (!(null == S || null == (e = S.data) ? void 0 : e.length)) return [];
                            let n = S.data.filter((e) => e.peakId === u);
                            return [
                                ...(n = n.map((e) => {
                                    var n, t;
                                    return {
                                        ...e,
                                        value:
                                            "log" === g
                                                ? Math.log10((null != (n = e.value) ? n : 0) + 1)
                                                : null != (t = e.value)
                                                  ? t
                                                  : 0,
                                    };
                                })),
                            ];
                        }, [S, g, u]),
                        R = (0, o.useMemo)(
                            () => ({
                                rows: j,
                                selected: t,
                                setSelected: d,
                                sortedFilteredData: f,
                                setSortedFilteredData: C,
                                transcriptExpressionData: S,
                                selectedPeak: u,
                                viewBy: m,
                                scale: g,
                                setPeak: h,
                                setViewBy: p,
                                setScale: x,
                                entity: n,
                            }),
                            [j, t, d, f, C, S, u, m, g, h, p, x, n]
                        );
                    return (0, a.jsx)(s.A, {
                        TableComponent: (0, a.jsx)(v, { ...R }),
                        plots: [
                            {
                                tabTitle: "Bar Plot",
                                icon: (0, a.jsx)(r.A, {}),
                                plotComponent: (0, a.jsx)(_, { ref: y, ...R }),
                                ref: y,
                            },
                            {
                                tabTitle: "Violin Plot",
                                icon: (0, a.jsx)(l.A, {}),
                                plotComponent: (0, a.jsx)(I, { ref: b, ...R }),
                                ref: b,
                            },
                        ],
                    });
                };
        },
        44945: (e, n, t) => {
            t.d(n, { P: () => l });
            var a = t(40650);
            let r = (0, t(78224).J)(
                    "\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput], $assembly: String!) {\n    snpQuery(assembly: $assembly, snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"
                ),
                l = (e) => {
                    let { rsID: n, coordinates: t, entityType: l, assembly: s, skip: i } = e,
                        {
                            data: o,
                            loading: c,
                            error: d,
                        } = (0, a.IT)(r, {
                            variables: { coordinates: t, snpids: n, assembly: s },
                            skip: i || (void 0 !== l && "variant" !== l) || "GRCh38" !== s,
                        });
                    return {
                        data:
                            t || "object" == typeof n
                                ? null == o
                                    ? void 0
                                    : o.snpQuery
                                : null == o
                                  ? void 0
                                  : o.snpQuery[0],
                        loading: c,
                        error: d,
                    };
                };
        },
        47165: (e, n, t) => {
            t.d(n, { default: () => C });
            var a = t(95155),
                r = t(15239),
                l = t(80317),
                s = t(96869),
                i = t(24288),
                o = t(50301),
                c = t(64647),
                d = t(80357),
                u = t(82293),
                h = t(83982),
                m = t(51760),
                p = t(12115),
                g = t(94824),
                x = t(60640),
                f = t(1684);
            let C = (e) => {
                let { entity: n } = e,
                    [t, C] = (0, p.useState)(null),
                    {
                        data: y,
                        loading: b,
                        error: S,
                    } = (0, u.H)({
                        coordinates: (0, f.oE)(n.entityID),
                        assembly: n.assembly,
                        nearbygeneslimit: 1,
                        cellType: t ? t.name : void 0,
                    }),
                    [v, j] = (0, p.useState)(null),
                    R = !t || (!!t && !!t.atac),
                    E = !t || (!!t && !!t.ctcf),
                    N = !t || (!!t && !!t.dnase),
                    A = !t || (!!t && !!t.h3k27ac),
                    w = !t || (!!t && !!t.h3k4me3),
                    T = (e) => {
                        C(e);
                    },
                    k = [
                        {
                            field: "info.accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Accession" }) }),
                            valueGetter: (e, n) => n.info.accession,
                            renderCell: (e) =>
                                (0, a.jsx)(m.g, {
                                    href: "/".concat(n.assembly, "/ccre/").concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "pct",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Class" }) }),
                            valueGetter: (e, n) =>
                                "PLS" === n.pct
                                    ? "Promoter"
                                    : "pELS" === n.pct
                                      ? "Proximal Enhancer"
                                      : "dELS" === n.pct
                                        ? "Distal Enhancer"
                                        : n.pct,
                        },
                        {
                            field: "chrom",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Chromosome" }) }),
                        },
                        {
                            field: "start",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Start" }) }),
                            valueGetter: (e, n) => n.start.toLocaleString(),
                        },
                        {
                            field: "end",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "End" }) }),
                            valueGetter: (e, n) => (n.start + n.len).toLocaleString(),
                            sortComparator: (e, n) => e - n,
                        },
                        ...(N
                            ? [
                                  {
                                      field: t && t.dnase ? "ctspecific.dnase_zscore" : "dnase_zscore",
                                      renderHeader: () =>
                                          (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "DNase" }) }),
                                      valueGetter: (e, n) =>
                                          t && t.dnase
                                              ? n.ctspecific.dnase_zscore.toFixed(2)
                                              : n.dnase_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                        ...(R
                            ? [
                                  {
                                      field: t && t.atac ? "ctspecific.atac_zscore" : "atac_zscore",
                                      renderHeader: () =>
                                          (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "ATAC" }) }),
                                      valueGetter: (e, n) =>
                                          t && t.atac ? n.ctspecific.atac_zscore.toFixed(2) : n.atac_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                        ...(E
                            ? [
                                  {
                                      field: t && t.ctcf ? "ctspecific.ctcf_zscore" : "ctcf_zscore",
                                      renderHeader: () =>
                                          (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "CTCF" }) }),
                                      valueGetter: (e, n) =>
                                          t && t.ctcf ? n.ctspecific.ctcf_zscore.toFixed(2) : n.ctcf_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                        ...(A
                            ? [
                                  {
                                      field: t && t.h3k27ac ? "ctspecific.h3k27ac_zscore" : "enhancer_zscore",
                                      renderHeader: () =>
                                          (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "H3K27ac" }) }),
                                      valueGetter: (e, n) =>
                                          t && t.h3k27ac
                                              ? n.ctspecific.h3k27ac_zscore.toFixed(2)
                                              : n.enhancer_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                        ...(w
                            ? [
                                  {
                                      field: t && t.h3k4me3 ? "ctspecific.h3k4me3_zscore" : "promoter_zscore",
                                      renderHeader: () =>
                                          (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "H3K4me3" }) }),
                                      valueGetter: (e, n) =>
                                          t && t.h3k4me3
                                              ? n.ctspecific.h3k4me3_zscore.toFixed(2)
                                              : n.promoter_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                        {
                            field: "nearestgene",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Nearest\xa0Gene" }) }),
                            valueGetter: (e, n) =>
                                ""
                                    .concat(n.nearestgenes[0].gene, " - ")
                                    .concat(n.nearestgenes[0].distance.toLocaleString(), " bp"),
                            renderCell: (e) =>
                                (0, a.jsxs)("span", {
                                    children: [
                                        (0, a.jsx)(m.g, {
                                            href: "/".concat(n.assembly, "/gene/").concat(e.row.nearestgenes[0].gene),
                                            children: (0, a.jsx)("i", { children: e.row.nearestgenes[0].gene }),
                                        }),
                                        "\xa0- ",
                                        e.row.nearestgenes[0].distance.toLocaleString(),
                                        " bp",
                                    ],
                                }),
                        },
                        {
                            field: "isicre",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "iCRE" }) }),
                            valueGetter: (e, n) => n.isicre,
                            renderCell: (e) =>
                                e.row.isicre
                                    ? (0, a.jsx)(m.g, {
                                          href: "https://igscreen.vercel.app/icre/".concat(e.row.info.accession),
                                          openInNewTab: !0,
                                          children: (0, a.jsx)(r.default, {
                                              src: "/igSCREEN_icon.png",
                                              alt: "igSCREEN Helix",
                                              height: 14,
                                              width: 14,
                                              style: { verticalAlign: "text-bottom" },
                                          }),
                                      })
                                    : (0, a.jsx)(a.Fragment, {}),
                        },
                    ];
                return S
                    ? (0, a.jsx)(l.default, { children: "Error Fetching Ccres" })
                    : (0, a.jsxs)(a.Fragment, {
                          children: [
                              t &&
                                  (0, a.jsxs)(s.default, {
                                      borderRadius: 1,
                                      direction: "row",
                                      justifyContent: "space-between",
                                      sx: { backgroundColor: (e) => e.palette.secondary.light },
                                      alignItems: "center",
                                      width: "fit-content",
                                      children: [
                                          (0, a.jsxs)(l.default, {
                                              sx: { color: "#2C5BA0", pl: 1 },
                                              children: [
                                                  (0, a.jsx)("b", { children: "Selected Biosample: " }),
                                                  " " +
                                                      t.ontology.charAt(0).toUpperCase() +
                                                      t.ontology.slice(1) +
                                                      " - " +
                                                      t.displayname,
                                              ],
                                          }),
                                          (0, a.jsx)(i.A, { onClick: () => T(null), children: (0, a.jsx)(g.A, {}) }),
                                      ],
                                  }),
                              (0, a.jsx)(h.XIK, {
                                  showToolbar: !0,
                                  rows: y || [],
                                  columns: k,
                                  loading: b,
                                  error: !!S,
                                  label: "Intersecting cCREs",
                                  emptyTableFallback: "No intersecting cCREs found in this region",
                                  toolbarSlot: (0, a.jsx)(o.A, {
                                      title: "Advanced Filters",
                                      children: (0, a.jsx)(c.default, {
                                          variant: "outlined",
                                          onClick: (e) => {
                                              if (v) j(null);
                                              else {
                                                  let n = e.currentTarget.getBoundingClientRect();
                                                  j({ getBoundingClientRect: () => n });
                                              }
                                          },
                                          children: "Select Biosample",
                                      }),
                                  }),
                                  divHeight: { maxHeight: "600px" },
                              }),
                              (0, a.jsx)(d.default, {
                                  onClick: (e) => {
                                      e.stopPropagation();
                                  },
                                  children: (0, a.jsx)(x.A, {
                                      assembly: n.assembly,
                                      open: !!v,
                                      setOpen: () => {
                                          v && j(null);
                                      },
                                      onChange: (e) => T(e[0]),
                                      initialSelected: t ? [t] : [],
                                  }),
                              }),
                          ],
                      });
            };
        },
        48295: (e, n, t) => {
            t.d(n, { A: () => o });
            var a = t(95155),
                r = t(96869),
                l = t(80317),
                s = t(80357),
                i = t(80494);
            function o(e) {
                let { browserStore: n, assembly: t } = e,
                    o = n((e) => e.domain);
                return (0, a.jsxs)(r.default, {
                    alignItems: "center",
                    children: [
                        (0, a.jsxs)(l.default, {
                            children: [o.chromosome, ":", o.start.toLocaleString(), "-", o.end.toLocaleString()],
                        }),
                        (0, a.jsx)(s.default, {
                            minHeight: 20,
                            flexGrow: 1,
                            display: "flex",
                            children: (0, a.jsx)("svg", {
                                width: "100%",
                                height: 20,
                                preserveAspectRatio: "xMidYMid meet",
                                viewBox: "0 0 700 20",
                                style: { alignSelf: "flex-end" },
                                children: (0, a.jsx)(i.Yp, {
                                    assembly: "GRCh38" === t ? "hg38" : "mm10",
                                    currentDomain: o,
                                }),
                            }),
                        }),
                    ],
                });
            }
        },
        50381: (e, n, t) => {
            t.d(n, { A: () => x });
            var a = t(95155),
                r = t(12115),
                l = t(96869),
                s = t(80317),
                i = t(80357),
                o = t(33427),
                c = t(45211),
                d = t(42404),
                u = t(20095),
                h = t(6257),
                m = t(94434),
                p = t(25039),
                g = t(58260);
            function x(e) {
                let { colorScheme: n, scatterData: t, maxValue: x, colorScale: f, scoreColorMode: C } = e,
                    { containerRef: y, TooltipInPortal: b } = (0, c.A)({ scroll: !0, detectBounds: !0 }),
                    {
                        tooltipData: S,
                        tooltipLeft: v,
                        tooltipTop: j,
                        tooltipOpen: R,
                        showTooltip: E,
                        hideTooltip: N,
                    } = (0, d.A)(),
                    A = (0, r.useMemo)(() => {
                        if (!t) return [];
                        if ("organ/tissue" === n || "sampleType" === n) {
                            let e = new Map();
                            return (
                                t.forEach((t) => {
                                    var a, r;
                                    let l = t.metaData,
                                        s =
                                            null !=
                                            (r =
                                                null != (a = l.tissue)
                                                    ? a
                                                    : "organ/tissue" === n
                                                      ? l.ontology
                                                      : l.sampleType)
                                                ? r
                                                : "missing";
                                    e.set(s, (e.get(s) || 0) + 1);
                                }),
                                Array.from(e.entries())
                                    .map((e) => {
                                        let [n, t] = e;
                                        return { label: n, color: m.Me[n], value: t };
                                    })
                                    .sort((e, n) => n.value - e.value)
                            );
                        }
                        return [];
                    }, [t, n]),
                    w = (0, r.useMemo)(() => {
                        switch (C) {
                            case "active":
                                return [f(1.65), f(4)].map(String);
                            case "all":
                                return [f(-4), f(0), f(4)].map(String);
                            default:
                                return [];
                        }
                    }, [f, C]);
                return (0, a.jsxs)(a.Fragment, {
                    children: [
                        "expression" === n
                            ? (0, a.jsxs)(l.default, {
                                  direction: "row",
                                  spacing: 0.5,
                                  alignItems: "center",
                                  mr: 1,
                                  children: [
                                      (0, a.jsx)(s.default, { children: "Log₁₀(TPM + 1)" }),
                                      (0, a.jsxs)(i.default, {
                                          sx: { display: "flex", alignItems: "center", width: "200px" },
                                          children: [
                                              (0, a.jsx)(s.default, { sx: { mr: 1 }, children: "0" }),
                                              (0, a.jsx)(i.default, {
                                                  sx: {
                                                      height: "16px",
                                                      flexGrow: 1,
                                                      background: "linear-gradient(to right, ".concat(
                                                          ((e) => {
                                                              let n = (0, g.M)(e, 9).map((e) => {
                                                                  let n = f(e);
                                                                  return "number" == typeof n ? (0, p.A)(n) : n;
                                                              });
                                                              return "#808080, ".concat(n.join(", "));
                                                          })(x),
                                                          ")"
                                                      ),
                                                      border: "1px solid #ccc",
                                                  },
                                              }),
                                              (0, a.jsx)(s.default, { sx: { ml: 1 }, children: x.toFixed(2) }),
                                          ],
                                      }),
                                  ],
                              })
                            : "score" === n
                              ? (0, a.jsxs)(i.default, {
                                    sx: { display: "flex", alignItems: "center", width: "200px" },
                                    children: [
                                        (0, a.jsx)(s.default, {
                                            sx: { mr: 1 },
                                            children: "active" === C ? "1.65" : "-4",
                                        }),
                                        (0, a.jsx)(i.default, {
                                            sx: {
                                                height: "12px",
                                                flexGrow: 1,
                                                background: "linear-gradient(to right, ".concat(w.join(", "), ")"),
                                                outline: "1px solid",
                                                outlineColor: "divider",
                                            },
                                        }),
                                        (0, a.jsx)(s.default, { sx: { ml: 1 }, children: 4 }),
                                    ],
                                })
                              : (0, a.jsxs)(l.default, {
                                    direction: "row",
                                    spacing: 1,
                                    alignItems: "center",
                                    mr: 1,
                                    onMouseMove: (e) =>
                                        ((e, n) => {
                                            let t = (0, h.A)(e, e);
                                            E({ tooltipLeft: t.x, tooltipTop: t.y - 200, tooltipData: n });
                                        })(e, t),
                                    onMouseLeave: N,
                                    ref: y,
                                    sx: {
                                        cursor: "default",
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 1,
                                        bgcolor: "action.hover",
                                        "&:hover": { bgcolor: "action.selected" },
                                        transition: "background-color 0.2s ease",
                                    },
                                    children: [
                                        (0, a.jsx)(o.A, { fontSize: "small", color: "action" }),
                                        (0, a.jsx)(s.default, {
                                            color: "text.secondary",
                                            fontWeight: "bold",
                                            children: "Legend:",
                                        }),
                                        A.slice(0, 3).map((e, n) =>
                                            (0, a.jsxs)(
                                                i.default,
                                                {
                                                    sx: { display: "flex", alignItems: "center", mr: 1 },
                                                    children: [
                                                        (0, a.jsx)(i.default, {
                                                            sx: {
                                                                width: 12,
                                                                height: 12,
                                                                bgcolor: e.color,
                                                                borderRadius: "50%",
                                                                mr: 0.5,
                                                            },
                                                        }),
                                                        (0, a.jsx)(s.default, {
                                                            variant: "body2",
                                                            color: "text.secondary",
                                                            children: e.label,
                                                        }),
                                                    ],
                                                },
                                                n
                                            )
                                        ),
                                        A.length > 3 &&
                                            (0, a.jsx)(l.default, {
                                                direction: "row",
                                                alignItems: "center",
                                                spacing: 1,
                                                children: (0, a.jsx)(s.default, {
                                                    variant: "body2",
                                                    color: "text.secondary",
                                                    children: "...",
                                                }),
                                            }),
                                    ],
                                }),
                        R &&
                            S &&
                            (0, a.jsx)(b, {
                                top: j,
                                left: v,
                                style: { zIndex: 1e3, ...u.k },
                                children: (0, a.jsx)(i.default, {
                                    sx: {
                                        display: "flex",
                                        justifyContent:
                                            (null == A ? void 0 : A.length) / 6 >= 3 ? "space-between" : "flex-start",
                                        gap: (null == A ? void 0 : A.length) / 6 >= 4 ? 0 : 10,
                                        p: 1,
                                    },
                                    children: Array.from(
                                        { length: Math.ceil((null == A ? void 0 : A.length) / 6) },
                                        (e, n) =>
                                            (0, a.jsx)(
                                                i.default,
                                                {
                                                    sx: { mr: 2 },
                                                    children: A.slice(6 * n, 6 * n + 6).map((e, n) =>
                                                        (0, a.jsxs)(
                                                            i.default,
                                                            {
                                                                sx: { display: "flex", alignItems: "center", mb: 1 },
                                                                children: [
                                                                    (0, a.jsx)(i.default, {
                                                                        sx: {
                                                                            width: 12,
                                                                            height: 12,
                                                                            bgcolor: e.color,
                                                                            mr: 1,
                                                                            borderRadius: "10px",
                                                                        },
                                                                    }),
                                                                    (0, a.jsxs)(s.default, {
                                                                        variant: "body2",
                                                                        children: [
                                                                            e.label
                                                                                .split(" ")
                                                                                .map(
                                                                                    (e) =>
                                                                                        e.charAt(0).toUpperCase() +
                                                                                        e.slice(1)
                                                                                )
                                                                                .join(" "),
                                                                            ": ",
                                                                            e.value,
                                                                        ],
                                                                    }),
                                                                ],
                                                            },
                                                            n
                                                        )
                                                    ),
                                                },
                                                n
                                            )
                                    ),
                                }),
                            }),
                    ],
                });
            }
        },
        51530: (e, n, t) => {
            t.d(n, { default: () => y });
            var a = t(95155),
                r = t(32941),
                l = t(12115),
                s = t(83982),
                i = t(94824),
                o = t(51760),
                c = t(40553),
                d = t(82293),
                u = t(80317),
                h = t(50301),
                m = t(96869),
                p = t(24288),
                g = t(64647),
                x = t(80357),
                f = t(60640),
                C = t(2369);
            let y = (e) => {
                let { entity: n } = e,
                    { data: t, loading: y, error: b } = (0, C.z)({ study: [n.entityID] }),
                    [S, v] = (0, l.useState)(null),
                    [j, R] = (0, l.useState)(null),
                    { data: E, loading: N, error: A } = (0, r.z)({ study: [n.entityID] }),
                    {
                        data: w,
                        loading: T,
                        error: k,
                    } = (0, d.H)({
                        accession: E ? (null == E ? void 0 : E.map((e) => e.accession)) : [],
                        assembly: "GRCh38",
                        nearbygeneslimit: 1,
                        cellType: j ? j.name : void 0,
                    }),
                    _ = (e) => {
                        R(e);
                    },
                    I = (0, l.useMemo)(() => {
                        if (!E || !w) return [];
                        let e = new Map(w.map((e) => [e.info.accession, e]));
                        return E.map((n) => ({
                            ...n,
                            nearestgenes: e.get(n.accession).nearestgenes || null,
                            ctspecific: e.get(n.accession).ctspecific,
                            dnase_zscore: e.get(n.accession).dnase_zscore,
                            ctcf_zscore: e.get(n.accession).ctcf_zscore,
                            atac_zscore: e.get(n.accession).atac_zscore,
                            enhancer_zscore: e.get(n.accession).enhancer_zscore,
                            promoter_zscore: e.get(n.accession).promoter_zscore,
                        }));
                    }, [E, w]),
                    M = !j || (!!j && !!j.atac),
                    F = !j || (!!j && !!j.ctcf),
                    G = !j || (!!j && !!j.dnase),
                    P = !j || (!!j && !!j.h3k27ac),
                    D = !j || (!!j && !!j.h3k4me3),
                    H = [
                        {
                            field: "total_ldblocks",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Total LD blocks" }) }),
                            valueGetter: (e, n) => n.total_ldblocks,
                        },
                        {
                            field: "ldblocks_overlapping_ccres",
                            renderHeader: () =>
                                (0, a.jsx)("strong", {
                                    children: (0, a.jsx)("p", { children: "# of LD blocks overlapping cCREs" }),
                                }),
                            valueGetter: (e, n) =>
                                n.ldblocks_overlapping_ccres +
                                " (" +
                                Math.ceil((n.ldblocks_overlapping_ccres / n.total_ldblocks) * 100) +
                                "%)",
                        },
                        {
                            field: "overlapping_ccres",
                            renderHeader: () =>
                                (0, a.jsx)("strong", {
                                    children: (0, a.jsx)("p", { children: "# of overlapping cCREs" }),
                                }),
                            valueGetter: (e, n) => n.overlapping_ccres,
                        },
                    ],
                    B = [
                        {
                            field: "accession",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Accession" }) }),
                            valueGetter: (e, n) => n.accession,
                            renderCell: (e) =>
                                (0, a.jsx)(o.g, {
                                    href: "/GRCh38/ccre/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "snpid",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "SNP" }) }),
                            valueGetter: (e, n) => n.snpid,
                        },
                        {
                            field: "ldblocksnpid",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "LD Block SNP ID" }) }),
                            valueGetter: (e, n) => n.ldblocksnpid,
                        },
                        {
                            field: "rsquare",
                            renderHeader: () =>
                                (0, a.jsx)("strong", {
                                    children: (0, a.jsxs)("p", {
                                        children: [
                                            (0, a.jsx)("i", { children: "R" }),
                                            (0, a.jsx)("sup", { children: "2" }),
                                        ],
                                    }),
                                }),
                            valueGetter: (e, n) => n.rsquare,
                        },
                        {
                            field: "nearestgenes",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Nearest\xa0Gene" }) }),
                            valueGetter: (e, n) =>
                                ""
                                    .concat(n.nearestgenes[0].gene, " - ")
                                    .concat(n.nearestgenes[0].distance.toLocaleString(), " bp"),
                            renderCell: (e) =>
                                (0, a.jsxs)("span", {
                                    children: [
                                        (0, a.jsx)(o.g, {
                                            href: "/GRCh38/gene/".concat(e.row.nearestgenes[0].gene),
                                            children: (0, a.jsx)("i", { children: e.row.nearestgenes[0].gene }),
                                        }),
                                        "\xa0- ",
                                        e.row.nearestgenes[0].distance.toLocaleString(),
                                        " bp",
                                    ],
                                }),
                        },
                        ...(M
                            ? [
                                  {
                                      field: j && j.atac ? "ctspecific.atac_zscore" : "atac_zscore",
                                      renderHeader: () => {
                                          let e = j && j.atac ? "ATAC" : "ATAC max Z";
                                          return (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: e }) });
                                      },
                                      valueGetter: (e, n) =>
                                          j && j.atac ? n.ctspecific.atac_zscore.toFixed(2) : n.atac_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                        ...(P
                            ? [
                                  {
                                      field: j && j.h3k27ac ? "ctspecific.enhancer_zscore" : "enhancer_zscore",
                                      renderHeader: () => {
                                          let e = j && j.h3k27ac ? "H3k27ac" : "H3k27ac max Z";
                                          return (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: e }) });
                                      },
                                      valueGetter: (e, n) =>
                                          j && j.h3k27ac
                                              ? n.ctspecific.h3k27ac_zscore.toFixed(2)
                                              : n.enhancer_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                        ...(D
                            ? [
                                  {
                                      field: j && j.h3k4me3 ? "ctspecific.h3k4me3_zscore" : "promoter_zscore",
                                      renderHeader: () => {
                                          let e = j && j.h3k4me3 ? "H3k4me3" : "H3k4me3 max Z";
                                          return (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: e }) });
                                      },
                                      valueGetter: (e, n) =>
                                          j && j.h3k4me3
                                              ? n.ctspecific.h3k4me3_zscore.toFixed(2)
                                              : n.promoter_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                        ...(F
                            ? [
                                  {
                                      field: j && j.ctcf ? "ctspecific.ctcf_zscore" : "ctcf_zscore",
                                      renderHeader: () => {
                                          let e = j && j.ctcf ? "CTCF" : "CTCF max Z";
                                          return (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: e }) });
                                      },
                                      valueGetter: (e, n) =>
                                          j && j.ctcf ? n.ctspecific.ctcf_zscore.toFixed(2) : n.ctcf_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                        ...(G
                            ? [
                                  {
                                      field: j && j.dnase ? "ctspecific.dnase_zscore" : "dnase_zscore",
                                      renderHeader: () => {
                                          let e = j && j.dnase ? "DNase" : "DNase max Z";
                                          return (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: e }) });
                                      },
                                      valueGetter: (e, n) =>
                                          j && j.dnase
                                              ? n.ctspecific.dnase_zscore.toFixed(2)
                                              : n.dnase_zscore.toFixed(2),
                                  },
                              ]
                            : []),
                    ],
                    z = (null == t ? void 0 : t.totalldblocks)
                        ? [
                              {
                                  total_ldblocks: t.totalldblocks,
                                  ldblocks_overlapping_ccres: E
                                      ? [...new Set([...E.map((e) => +e.ldblock)])].length
                                      : 0,
                                  overlapping_ccres: E ? [...new Set(E.map((e) => e.accession))].length : 0,
                              },
                          ]
                        : void 0;
                return A || k
                    ? (0, a.jsx)(u.default, {
                          children: "Error Fetching Intersecting cCREs against SNPs identified by a GWAS study",
                      })
                    : (0, a.jsxs)(a.Fragment, {
                          children: [
                              (0, a.jsx)(s.XIK, {
                                  rows: z || [],
                                  columns: H,
                                  loading: N,
                                  label: "LD Blocks",
                                  emptyTableFallback:
                                      "No Intersecting cCREs found against SNPs identified by GWAS study",
                                  divHeight: { height: "100%", minHeight: "50px", maxHeight: "600px" },
                                  labelTooltip: (0, a.jsx)(h.A, {
                                      title: "LD Blocks are regions of the genome where genetic variants are inherited together due to high levels of linkage disequilibrium (LD)",
                                      children: (0, a.jsx)(c.A, { fontSize: "inherit" }),
                                  }),
                              }),
                              j &&
                                  (0, a.jsxs)(m.default, {
                                      borderRadius: 1,
                                      direction: "row",
                                      justifyContent: "space-between",
                                      sx: { backgroundColor: (e) => e.palette.secondary.light },
                                      alignItems: "center",
                                      width: "fit-content",
                                      children: [
                                          (0, a.jsxs)(u.default, {
                                              sx: { color: "#2C5BA0", pl: 1 },
                                              children: [
                                                  (0, a.jsx)("b", { children: "Selected Biosample: " }),
                                                  " " +
                                                      j.ontology.charAt(0).toUpperCase() +
                                                      j.ontology.slice(1) +
                                                      " - " +
                                                      j.displayname,
                                              ],
                                          }),
                                          (0, a.jsx)(p.A, { onClick: () => _(null), children: (0, a.jsx)(i.A, {}) }),
                                      ],
                                  }),
                              (0, a.jsx)(s.XIK, {
                                  showToolbar: !0,
                                  rows: I || [],
                                  columns: B,
                                  loading: N || T,
                                  label: "Intersecting cCREs",
                                  emptyTableFallback:
                                      "No Intersecting cCREs found against SNPs identified by GWAS study",
                                  initialState: { sorting: { sortModel: [{ field: "rsquare", sort: "desc" }] } },
                                  divHeight: { height: "100%", minHeight: "580px", maxHeight: "600px" },
                                  labelTooltip: (0, a.jsx)(h.A, {
                                      title: "cCREs intersected against SNPs identified by selected GWAS study",
                                      children: (0, a.jsx)(c.A, { fontSize: "inherit" }),
                                  }),
                                  toolbarSlot: (0, a.jsx)(h.A, {
                                      title: "Advanced Filters",
                                      children: (0, a.jsx)(g.default, {
                                          variant: "outlined",
                                          onClick: (e) => {
                                              if (S) v(null);
                                              else {
                                                  let n = e.currentTarget.getBoundingClientRect();
                                                  v({ getBoundingClientRect: () => n });
                                              }
                                          },
                                          children: "Select Biosample",
                                      }),
                                  }),
                              }),
                              (0, a.jsx)(x.default, {
                                  onClick: (e) => {
                                      e.stopPropagation();
                                  },
                                  children: (0, a.jsx)(f.A, {
                                      assembly: "GRCh38",
                                      open: !!S,
                                      setOpen: () => {
                                          S && v(null);
                                      },
                                      initialSelected: j ? [j] : [],
                                      onChange: (e) => _(e[0]),
                                  }),
                              }),
                          ],
                      });
            };
        },
        51760: (e, n, t) => {
            t.d(n, { g: () => o });
            var a = t(95155),
                r = t(32630),
                l = t(37440),
                s = t(52619),
                i = t.n(s);
            let o = (e) => {
                let { showExternalIcon: n, openInNewTab: t = !1, children: s, ...o } = e;
                return (0, a.jsxs)(l.A, {
                    component: i(),
                    rel: t ? "noopener noreferrer" : void 0,
                    target: t ? "_blank" : void 0,
                    ...o,
                    children: [
                        s,
                        n &&
                            (0, a.jsx)(r.A, {
                                sx: { display: "inline-flex", verticalAlign: "middle", ml: 0.5 },
                                color: "inherit",
                                fontSize: "inherit",
                            }),
                    ],
                });
            };
        },
        52403: (e, n, t) => {
            t.d(n, { V: () => i });
            var a = t(40650),
                r = t(78224),
                l = t(12115);
            let s = (0, r.J)(
                    "\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String], $assembly: String!, $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: $assembly, version: $version, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n        transcripts {\n      coordinates {\n        chromosome\n        end\n        start\n      }\n      id\n      name\n      strand\n    }\n    }\n  }\n"
                ),
                i = (e) => {
                    let { name: n, coordinates: t, entityType: r, assembly: i, skip: o } = e,
                        c = "GRCh38" === i && !o && (void 0 === r || "gene" === r),
                        d = (0, a.IT)(s, {
                            variables: {
                                chromosome: null == t ? void 0 : t.chromosome,
                                start: null == t ? void 0 : t.start,
                                end: null == t ? void 0 : t.end,
                                assembly: i,
                                version: 29,
                                name: n,
                            },
                            skip: !c,
                        }),
                        u = (0, a.IT)(s, {
                            variables: {
                                chromosome: null == t ? void 0 : t.chromosome,
                                start: null == t ? void 0 : t.start,
                                end: null == t ? void 0 : t.end,
                                assembly: i,
                                version: 40,
                                name: n,
                            },
                            skip: !c,
                        }),
                        h = (0, a.IT)(s, {
                            variables: {
                                chromosome: null == t ? void 0 : t.chromosome,
                                start: null == t ? void 0 : t.start,
                                end: null == t ? void 0 : t.end,
                                assembly: i,
                                version: 25,
                                name: n,
                            },
                            skip: "mm10" !== i || o || (void 0 !== r && "gene" !== r),
                        }),
                        m = (0, l.useMemo)(() => {
                            var e, n, t, a, r, l, s;
                            if ("GRCh38" !== i) return null == (s = h.data) ? void 0 : s.gene;
                            {
                                if (
                                    d.loading ||
                                    u.loading ||
                                    (!(null == (e = d.data) ? void 0 : e.gene) &&
                                        !(null == (n = u.data) ? void 0 : n.gene))
                                )
                                    return;
                                let s = new Map();
                                return (
                                    null == (a = d.data) ||
                                        null == (t = a.gene) ||
                                        t.forEach((e) => {
                                            e && s.set(e.id, e);
                                        }),
                                    null == (l = u.data) ||
                                        null == (r = l.gene) ||
                                        r.forEach((e) => {
                                            e && s.set(e.id, e);
                                        }),
                                    Array.from(s.values())
                                );
                            }
                        }, [i, d.data, u.data, h.data, d.loading, u.loading]),
                        p = "GRCh38" === i ? d.loading || u.loading : h.loading,
                        g = "GRCh38" === i ? d.error || u.error : h.error;
                    return { data: t || "object" == typeof n ? m : null == m ? void 0 : m[0], loading: p, error: g };
                };
        },
        56085: (e, n, t) => {
            t.d(n, { Dr: () => s.OpenEntitiesContext, Kt: () => l });
            var a = t(1552),
                r = t(57450);
            let l = (e) =>
                (0, a.z)(e.assembly) &&
                (0, r.Ii)(e.assembly, e.entityType) &&
                (0, r.Qu)(e.assembly, e.entityType, e.tab);
            var s = t(24663);
        },
        57450: (e, n, t) => {
            t.d(n, { Ib: () => H, Kn: () => W, h6: () => L, Ii: () => B, Qu: () => z, ve: () => _ });
            var a = t(67592),
                r = t(17889),
                l = t(95395),
                s = t(33961),
                i = t(16394),
                o = t(16264),
                c = t(9553),
                d = t(5683),
                u = t(3205),
                h = t(58154),
                m = t(44396),
                p = t(22218),
                g = t(37969),
                x = t(23223),
                f = t(98774),
                C = t(51530),
                y = t(36376),
                b = t(66428),
                S = t(47165),
                v = t(66645),
                j = t(88343),
                R = t(86265);
            let E = "/assets/GbIcon.svg",
                N = "/assets/CcreIcon.svg",
                A = "/assets/GeneIcon.svg",
                w = "/assets/VariantIcon.svg",
                T = "/assets/ConservationIcon.svg",
                k = "/assets/FunctionalCharacterizationIcon.svg",
                _ = { GRCh38: ["ccre", "gene", "variant", "region", "gwas"], mm10: ["ccre", "gene", "region"] },
                I = [
                    { route: "", label: "Variant", iconPath: w, component: p.default },
                    { route: "ccres", label: "cCREs", iconPath: N, component: g.default },
                    { route: "genes", label: "Genes", iconPath: A, component: h.default },
                    { route: "browser", label: "Genome Browser", iconPath: E, component: R.default },
                ],
                M = [
                    { route: "", label: "Gene", iconPath: A, component: d.default },
                    { route: "ccres", label: "cCREs", iconPath: N, component: u.default },
                    { route: "variants", label: "Variants", iconPath: w, component: h.default },
                    { route: "conservation", label: "Conservation", iconPath: T, component: i.default },
                    { route: "browser", label: "Genome Browser", iconPath: E, component: R.default },
                    { route: "transcript-expression", label: "Transcript Expression", component: m.default },
                ],
                F = [
                    {
                        route: "biosample_enrichment",
                        label: "Biosample Enrichment",
                        iconPath: "/assets/BiosampleEnrichmentIcon.svg",
                        component: x.default,
                    },
                    { route: "variants", label: "Variants", iconPath: w, component: f.GWASStudySNPs },
                    { route: "ccres", label: "cCREs", iconPath: N, component: C.default },
                    { route: "genes", label: "Genes", iconPath: A, component: y.GWASStudyGenes },
                    { route: "browser", label: "Genome Browser", iconPath: E, component: b.default },
                ],
                G = [
                    { route: "", label: "cCRE", iconPath: N, component: a.BiosampleActivity },
                    { route: "genes", label: "Genes", iconPath: A, component: o.default },
                    { route: "variants", label: "Variants", iconPath: w, component: c.default },
                    { route: "conservation", label: "Conservation", iconPath: T, component: r.Conservation },
                    {
                        route: "functional-characterization",
                        label: "Functional Characterization",
                        iconPath: k,
                        component: l.FunctionalCharacterization,
                    },
                    { route: "browser", label: "Genome Browser", iconPath: E, component: R.default },
                    {
                        route: "additional-chromatin-signatures",
                        label: "Additional Chromatin Signatures",
                        component: s.AdditionalChromatinSignatures,
                    },
                ],
                P = [
                    { route: "ccres", label: "cCREs", iconPath: N, component: S.default },
                    { route: "genes", label: "Genes", iconPath: A, component: v.default },
                    { route: "variants", label: "Variant", iconPath: w, component: j.default },
                    { route: "browser", label: "Genome Browser", iconPath: E, component: R.default },
                ],
                D = [
                    { route: "", label: "Gene", iconPath: A, component: d.default },
                    { route: "ccres", label: "cCREs", iconPath: N, component: u.default },
                    { route: "conservation", label: "Conservation", iconPath: T, component: i.default },
                    { route: "browser", label: "Genome Browser", iconPath: E, component: R.default },
                ],
                H = {
                    GRCh38: { variant: I, gene: M, ccre: G, region: P, gwas: F },
                    mm10: {
                        gene: D,
                        ccre: [
                            { route: "", label: "cCRE", iconPath: N, component: a.BiosampleActivity },
                            { route: "genes", label: "Genes", iconPath: A, component: o.default },
                            { route: "conservation", label: "Conservation", iconPath: T, component: r.Conservation },
                            {
                                route: "functional-characterization",
                                label: "Functional Characterization",
                                iconPath: k,
                                component: l.FunctionalCharacterization,
                            },
                            { route: "browser", label: "Genome Browser", iconPath: E, component: R.default },
                        ],
                        region: [
                            { route: "ccres", label: "cCREs", iconPath: N, component: S.default },
                            { route: "genes", label: "Genes", iconPath: A, component: v.default },
                            { route: "browser", label: "Genome Browser", iconPath: E, component: R.default },
                        ],
                    },
                },
                B = (e, n) => _[e].includes(n),
                z = (e, n, t) => H[e][n].some((e) => e.route === t),
                L = (e, n) => H[e][n],
                W = (e) => {
                    switch (e.assembly) {
                        case "GRCh38":
                            return H.GRCh38[e.entityType].find((n) => n.route === e.tab).component;
                        case "mm10":
                            return H.mm10[e.entityType].find((n) => n.route === e.tab).component;
                    }
                };
        },
        58154: (e, n, t) => {
            t.d(n, { default: () => h });
            var a = t(95155),
                r = t(40650),
                l = t(96869),
                s = t(80357),
                i = t(1684),
                o = t(81362),
                c = t(51760),
                d = t(83982);
            let u = (0, o.J1)(
                "\nquery getimmuneeQTLsQuery($genes: [String], $snps: [String],$ccre: [String]) {\n  immuneeQTLsQuery(genes: $genes, snps: $snps, ccre: $ccre) {\n    rsid\n    genename\n    study\n    fdr\n    celltype\n    ref\n    chromosome\n    position\n    alt\n    variant_id    \n    pval_nominal\n    ccre\n    slope\n    spearmans_rho\n  }\n} \n"
            );
            function h(e) {
                let n,
                    t,
                    { entity: o } = e,
                    { entityID: h, entityType: m, assembly: p } = o,
                    g = {};
                (g = "gene" === m ? { genes: [h] } : "ccre" === m ? { ccre: [h] } : { snps: [h] }),
                    (n = "GTEX whole-blood eQTLs for ".concat(h)),
                    (t = "OneK1K eQTLs for ".concat(h));
                let { loading: x, error: f, data: C } = (0, r.IT)(u, { variables: g, skip: !o }),
                    y = null == C ? void 0 : C.immuneeQTLsQuery.filter((e) => "GTEX" === e.study),
                    b = null == C ? void 0 : C.immuneeQTLsQuery.filter((e) => "OneK1K" === e.study),
                    S = [];
                S.push({ field: "variant_id", headerName: "Variant Name" }),
                    ("gene" === m || "ccre" === m) &&
                        S.push({
                            field: "rsid",
                            headerName: "rsID",
                            renderCell: (e) =>
                                "." === e.value
                                    ? (0, a.jsx)(a.Fragment, { children: e.value })
                                    : (0, a.jsx)(c.g, {
                                          href: "/".concat(p, "/variant/").concat(e.value),
                                          children: e.value,
                                      }),
                        }),
                    ("variant" === m || "ccre" === m) &&
                        S.push({
                            field: "genename",
                            headerName: "Gene",
                            renderCell: (e) =>
                                "." === e.value
                                    ? (0, a.jsx)(a.Fragment, { children: e.value })
                                    : (0, a.jsx)(c.g, {
                                          href: "/".concat(p, "/gene/").concat(e.value),
                                          children: e.value,
                                      }),
                        }),
                    ("gene" === m || "ccre" === m) &&
                        S.push(
                            { field: "chromosome", headerName: "Chromosome" },
                            { field: "position", headerName: "Position" },
                            { field: "ref", headerName: "Ref" },
                            { field: "alt", headerName: "Alt" }
                        ),
                    S.push(
                        {
                            field: "slope",
                            headerName: "Slope",
                            display: "flex",
                            renderCell: (e) => (0, i.pk)(e.value, 2, { variant: "body2" }),
                        },
                        {
                            field: "pval_nominal",
                            headerName: "Nominal P",
                            display: "flex",
                            renderCell: (e) => (0, i.pk)(e.value, 2, { variant: "body2" }),
                        }
                    ),
                    ("gene" === m || "variant" === m) &&
                        S.push({
                            field: "ccre",
                            headerName: "ccre",
                            renderCell: (e) =>
                                "." === e.value
                                    ? (0, a.jsx)(a.Fragment, { children: e.value })
                                    : (0, a.jsx)(c.g, {
                                          href: "/".concat(p, "/ccre/").concat(e.value),
                                          children: e.value,
                                      }),
                        });
                let v = [];
                return (
                    ("gene" === m || "ccre" === m) &&
                        v.push(
                            {
                                field: "rsid",
                                headerName: "rsID",
                                renderCell: (e) =>
                                    (0, a.jsx)(c.g, {
                                        href: "/".concat(p, "/variant/").concat(e.value),
                                        children: e.value,
                                    }),
                            },
                            { field: "chromosome", headerName: "Chromosome" },
                            { field: "position", headerName: "Position" }
                        ),
                    ("variant" === m || "ccre" === m) &&
                        v.push({
                            field: "genename",
                            headerName: "Gene",
                            renderCell: (e) =>
                                (0, a.jsx)(c.g, { href: "/".concat(p, "/gene/").concat(e.value), children: e.value }),
                        }),
                    ("gene" === m || "ccre" === m) &&
                        v.push({ field: "ref", headerName: "A1" }, { field: "alt", headerName: "A2" }),
                    v.push(
                        {
                            field: "fdr",
                            headerName: "FDR",
                            display: "flex",
                            renderCell: (e) => (0, i.pk)(e.value, 2, { variant: "body2" }),
                        },
                        {
                            field: "spearmans_rho",
                            headerName: "Spearman's rho",
                            display: "flex",
                            renderCell: (e) => (0, i.pk)(e.value, 2, { variant: "body2" }),
                        },
                        { field: "celltype", headerName: "Celltype" }
                    ),
                    ("gene" === m || "variant" === m) &&
                        v.push({
                            field: "ccre",
                            headerName: "ccre",
                            renderCell: (e) =>
                                "." === e.value
                                    ? (0, a.jsx)(a.Fragment, { children: e.value })
                                    : (0, a.jsx)(c.g, {
                                          href: "/".concat(p, "/ccre/").concat(e.value),
                                          children: e.value,
                                      }),
                        }),
                    (0, a.jsxs)(l.default, {
                        spacing: 2,
                        children: [
                            (0, a.jsx)(s.default, {
                                sx: { flex: "1 1 auto" },
                                children: (0, a.jsx)(d.XIK, {
                                    columns: S,
                                    rows: y,
                                    loading: x,
                                    error: !!f,
                                    label: n,
                                    initialState: { sorting: { sortModel: [{ field: "pval_nominal", sort: "asc" }] } },
                                    emptyTableFallback: "No GTEX whole-blood eQTLs found",
                                    divHeight: { maxHeight: "400px" },
                                }),
                            }),
                            (0, a.jsx)(s.default, {
                                sx: { flex: "1 1 auto" },
                                children: (0, a.jsx)(d.XIK, {
                                    columns: v,
                                    rows: b,
                                    loading: x,
                                    error: !!f,
                                    label: t,
                                    initialState: { sorting: { sortModel: [{ field: "fdr", sort: "asc" }] } },
                                    emptyTableFallback: "No OneK1K eQTLs found",
                                    divHeight: { maxHeight: "400px" },
                                }),
                            }),
                        ],
                    })
                );
            }
        },
        58260: (e, n, t) => {
            t.d(n, { A: () => y, M: () => C });
            var a = t(95155),
                r = t(80317),
                l = t(62995),
                s = t(44177),
                i = t(51404),
                o = t(23405),
                c = t(80357),
                d = t(12115),
                u = t(93320),
                h = t(94434),
                m = t(94457),
                p = t(20146),
                g = t(25039),
                x = t(27441),
                f = t(50381);
            let C = (e, n) => Array.from({ length: n }, (t, a) => (a / (n - 1)) * e),
                y = (e) => {
                    var n, t;
                    let { entity: y, selected: b, geneExpressionData: S, setSelected: v, ref: j, ...R } = e,
                        [E, N] = (0, d.useState)("expression"),
                        { data: A, loading: w } = S,
                        T = (e) => {
                            N(e.target.value);
                        };
                    function k(e) {
                        return Math.log10(e + 1);
                    }
                    let _ = (0, d.useMemo)(
                            () =>
                                A && 0 !== A.length
                                    ? Math.max(
                                          ...A.map((e) => {
                                              var n;
                                              return k(
                                                  null == (n = e.gene_quantification_files[0].quantifications[0])
                                                      ? void 0
                                                      : n.tpm
                                              );
                                          })
                                      )
                                    : 0,
                            [A]
                        ),
                        I = (0, d.useMemo)(
                            () =>
                                (0, p.A)({
                                    domain: C(_, 9),
                                    range: Array.from({ length: 9 }, (e, n) => n / 8),
                                    clamp: !0,
                                }),
                            [_]
                        ),
                        M = (0, d.useMemo)(() => {
                            if (!A) return [];
                            let e = (e) => b.some((n) => n.accession === e.accession);
                            return A.map((n) => {
                                var t;
                                let a = (0, g.A)(
                                    I(
                                        k(
                                            null == (t = n.gene_quantification_files[0].quantifications[0])
                                                ? void 0
                                                : t.tpm
                                        )
                                    )
                                );
                                return {
                                    x: n.umap_1,
                                    y: n.umap_2,
                                    r: e(n) ? 6 : 4,
                                    color:
                                        e(n) || 0 === b.length ? ("expression" === E ? a : h.Me[n.tissue]) : "#CCCCCC",
                                    metaData: n,
                                };
                            });
                        }, [A, b, I, E]),
                        F = (e) => {
                            let n = (() => {
                                let n = e.metaData.gene_quantification_files || [],
                                    t = [];
                                return (n.forEach((e) => {
                                    if (e.quantifications && e.quantifications.length > 0) {
                                        var n;
                                        let a = null == (n = e.quantifications[0]) ? void 0 : n.tpm;
                                        null != a && t.push(a);
                                    }
                                }),
                                0 === t.length)
                                    ? null
                                    : t.reduce((e, n) => e + n, 0) / t.length;
                            })();
                            return (0, a.jsxs)(a.Fragment, {
                                children: [
                                    (0, a.jsxs)(r.default, {
                                        children: [
                                            (0, a.jsx)("b", { children: "Accession:" }),
                                            " ",
                                            e.metaData.accession,
                                        ],
                                    }),
                                    (0, a.jsxs)(r.default, {
                                        children: [
                                            (0, a.jsx)("b", { children: "Biosample:" }),
                                            " ",
                                            e.metaData.biosample,
                                        ],
                                    }),
                                    (0, a.jsxs)(r.default, {
                                        children: [(0, a.jsx)("b", { children: "Tissue:" }), " ", e.metaData.tissue],
                                    }),
                                    (0, a.jsxs)(r.default, {
                                        children: [
                                            (0, a.jsx)("b", { children: "TPM:" }),
                                            " ",
                                            "expression" === E ? k(n).toFixed(2) : n.toFixed(2),
                                        ],
                                    }),
                                ],
                            });
                        };
                    return (0, a.jsx)(a.Fragment, {
                        children: (0, a.jsx)(x.default, {
                            width: "100%",
                            height: "100%",
                            padding: 1,
                            sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" },
                            children:
                                M &&
                                M.length > 0 &&
                                (null == (t = M[0].metaData.gene_quantification_files[0]) ||
                                null == (n = t.quantifications[0])
                                    ? void 0
                                    : n.tpm) !== void 0
                                    ? (0, a.jsxs)(a.Fragment, {
                                          children: [
                                              (0, a.jsxs)(x.default, {
                                                  direction: "row",
                                                  justifyContent: "space-between",
                                                  alignItems: "center",
                                                  children: [
                                                      (0, a.jsx)(
                                                          () =>
                                                              (0, a.jsxs)(l.A, {
                                                                  sx: { alignSelf: "flex-start" },
                                                                  children: [
                                                                      (0, a.jsx)(s.A, { children: "Color By" }),
                                                                      (0, a.jsxs)(i.A, {
                                                                          labelId: "demo-simple-select-label",
                                                                          id: "demo-simple-select",
                                                                          value: E,
                                                                          label: "Color By",
                                                                          onChange: T,
                                                                          MenuProps: { disableScrollLock: !0 },
                                                                          size: "small",
                                                                          children: [
                                                                              (0, a.jsx)(o.A, {
                                                                                  value: "expression",
                                                                                  children: "Expression",
                                                                              }),
                                                                              (0, a.jsx)(o.A, {
                                                                                  value: "organ/tissue",
                                                                                  children: "Tissue",
                                                                              }),
                                                                          ],
                                                                      }),
                                                                  ],
                                                              }),
                                                          {}
                                                      ),
                                                      (0, a.jsx)(f.A, {
                                                          colorScheme: E,
                                                          scatterData: M,
                                                          maxValue: _,
                                                          colorScale: I,
                                                      }),
                                                  ],
                                              }),
                                              (0, a.jsx)(c.default, {
                                                  sx: { flexGrow: 1 },
                                                  children: (0, a.jsx)(u.IG, {
                                                      ...R,
                                                      onSelectionChange: (e) => {
                                                          v([...b, ...e.map((e) => e.metaData)]);
                                                      },
                                                      onPointClicked: () => console.error("onClick missing"),
                                                      controlsHighlight: m.theme.palette.primary.light,
                                                      pointData: M,
                                                      selectable: !0,
                                                      loading: w,
                                                      miniMap: { position: { right: 50, bottom: 50 } },
                                                      groupPointsAnchor: "accession",
                                                      tooltipBody: (e) => (0, a.jsx)(F, { ...e }),
                                                      leftAxisLabel: "UMAP-2",
                                                      bottomAxisLabel: "UMAP-1",
                                                      ref: j,
                                                      downloadFileName: "".concat(y.entityID, "_expression_UMAP"),
                                                  }),
                                              }),
                                          ],
                                      })
                                    : (0, a.jsx)(a.Fragment, {}),
                        }),
                    });
                };
        },
        60640: (e, n, t) => {
            t.d(n, { A: () => f });
            var a = t(95155),
                r = t(12115),
                l = t(75265),
                s = t(96869),
                i = t(2021),
                o = t(24288),
                c = t(73224),
                d = t(99496),
                u = t(80317),
                h = t(66370),
                m = t(64647),
                p = t(35577),
                g = t(29999),
                x = t(21066);
            let f = (e) => {
                let {
                        assembly: n,
                        open: t,
                        setOpen: f,
                        onChange: C,
                        multiSelect: y = !1,
                        multiSelectLimit: b = 10,
                        initialSelected: S = [],
                    } = e,
                    [v, j] = (0, r.useState)(S);
                (0, r.useEffect)(() => {
                    t && j(S);
                }, [S, t]);
                let R = () => f(!1);
                return (0, a.jsxs)(l.A, {
                    open: t,
                    onClose: R,
                    disableRestoreFocus: !0,
                    sx: { "& .MuiDialog-paper": { maxWidth: "none" } },
                    children: [
                        (0, a.jsxs)(s.default, {
                            direction: "row",
                            justifyContent: "space-between",
                            children: [
                                (0, a.jsx)(i.A, { children: "Select a biosample to view biosample specific z-scores" }),
                                (0, a.jsx)(o.A, {
                                    size: "large",
                                    onClick: R,
                                    sx: { mr: 1 },
                                    children: (0, a.jsx)(p.A, { fontSize: "inherit" }),
                                }),
                            ],
                        }),
                        (0, a.jsxs)(c.A, {
                            mb: 2,
                            display: y ? "block" : "none",
                            sx: { px: 3 },
                            children: ["Note: Must chose ", b, " or fewer biosamples."],
                        }),
                        (0, a.jsx)(d.A, {
                            sx: { pt: 0 },
                            children: (0, a.jsxs)(s.default, {
                                direction: { xs: "column", md: "row" },
                                spacing: 2,
                                children: [
                                    (0, a.jsx)(x.A, {
                                        assembly: n,
                                        showRNAseq: !0,
                                        selected: y ? v.map((e) => e.name) : v.map((e) => e.name)[0],
                                        onChange: (e) => {
                                            y ? j(e) : j([e]);
                                        },
                                        slotProps: { paperStack: { minWidth: { xs: "300px", lg: "500px" } } },
                                        allowMultiSelect: y,
                                        showCheckboxes: y,
                                    }),
                                    v.length > 0 &&
                                        (0, a.jsxs)("div", {
                                            children: [
                                                (0, a.jsx)(u.default, {
                                                    minWidth: "350px",
                                                    visibility: v.length > 0 ? "visible" : "hidden",
                                                    mt: 2,
                                                    children: "Selected Biosamples:",
                                                }),
                                                v.map((e, n) =>
                                                    (0, a.jsxs)(
                                                        s.default,
                                                        {
                                                            minWidth: "350px",
                                                            mt: 1,
                                                            direction: "row",
                                                            alignItems: "center",
                                                            children: [
                                                                (0, a.jsx)(o.A, {
                                                                    onClick: () =>
                                                                        j((n) =>
                                                                            n.filter(
                                                                                (n) => n.displayname !== e.displayname
                                                                            )
                                                                        ),
                                                                    children: (0, a.jsx)(g.A, {}),
                                                                }),
                                                                (0, a.jsx)(u.default, { children: e.displayname }),
                                                            ],
                                                        },
                                                        n
                                                    )
                                                ),
                                            ],
                                        }),
                                ],
                            }),
                        }),
                        (0, a.jsx)(h.A, {
                            children: (0, a.jsx)(m.default, {
                                sx: { textTransform: "none" },
                                variant: "contained",
                                onClick: () => {
                                    C(v), R();
                                },
                                disabled: !!y && v.length > b,
                                children: "Submit",
                            }),
                        }),
                    ],
                });
            };
        },
        66428: (e, n, t) => {
            t.d(n, { default: () => B });
            var a = t(3648),
                r = t(95155),
                l = t(12981),
                s = t(80357),
                i = t(24288),
                o = t(64647),
                c = t(97179),
                d = t(91665),
                u = t(25789),
                h = t(80494),
                m = t(83982),
                p = t(12115),
                g = t(87189),
                x = t(81745),
                f = t(88632),
                C = t(20063),
                y = t(27919),
                b = t(48295),
                S = t(35448),
                v = t(75265),
                j = t(96869),
                R = t(2021),
                E = t(99496),
                N = t(56919),
                A = t(7291),
                w = t(1123),
                T = t(80317),
                k = t(66370),
                _ = t(35577);
            let I = (e) => {
                let { ldblock: n, ldblockList: t, open: a, setOpen: l, onLdBlockSelect: s } = e,
                    [c, d] = (0, p.useState)(JSON.stringify(n));
                return (
                    (0, p.useEffect)(() => {
                        a && n && d(JSON.stringify(n));
                    }, [a, n]),
                    (0, r.jsxs)(v.A, {
                        open: a,
                        onClose: () => l(!1),
                        disableRestoreFocus: !0,
                        children: [
                            (0, r.jsxs)(j.default, {
                                direction: "row",
                                justifyContent: "space-between",
                                children: [
                                    (0, r.jsx)(R.A, { children: "Select LD Block" }),
                                    (0, r.jsx)(i.A, {
                                        size: "large",
                                        onClick: () => l(!1),
                                        sx: { mr: 1 },
                                        children: (0, r.jsx)(_.A, { fontSize: "inherit" }),
                                    }),
                                ],
                            }),
                            (0, r.jsx)(E.A, {
                                children: (0, r.jsx)(N.A, {
                                    value: c,
                                    onChange: (e) => d(e.target.value),
                                    children: t.map((e) =>
                                        (0, r.jsx)(
                                            A.A,
                                            {
                                                value: JSON.stringify(e),
                                                control: (0, r.jsx)(w.A, {}),
                                                label: (0, r.jsxs)("span", {
                                                    children: [
                                                        e.ldblock,
                                                        " ",
                                                        (0, r.jsxs)(T.default, {
                                                            component: "span",
                                                            variant: "body2",
                                                            color: "text.secondary",
                                                            children: [
                                                                "(",
                                                                e.chromosome,
                                                                ":",
                                                                e.start,
                                                                "-",
                                                                e.end,
                                                                ")",
                                                            ],
                                                        }),
                                                    ],
                                                }),
                                            },
                                            e.ldblock
                                        )
                                    ),
                                }),
                            }),
                            (0, r.jsx)(k.A, {
                                children: (0, r.jsx)(o.default, {
                                    sx: { textTransform: "none" },
                                    variant: "contained",
                                    onClick: () => {
                                        s(JSON.parse(c)), l(!1);
                                    },
                                    children: "Submit",
                                }),
                            }),
                        ],
                    })
                );
            };
            var M = t(80207);
            function F() {
                let e = (0, a._)([
                    "\n  query getSNPsforgivengwasStudy($study: [String!]!) {\n    getSNPsforGWASStudies(study: $study) {\n      snpid\n      ldblock\n      rsquare\n      chromosome\n      stop\n      start\n      ldblocksnpid\n      __typename\n    }\n  }\n",
                ]);
                return (
                    (F = function () {
                        return e;
                    }),
                    e
                );
            }
            function G(e) {
                let n = e.end - e.start;
                n <= 100 && (n = 100);
                let t = Math.floor(0.25 * n);
                return { chromosome: e.chromosome, start: e.start - t, end: e.end + t };
            }
            let P = (0, h.WG)({
                    domain: { chromosome: "chr1", start: 52e3, end: 53e3 },
                    marginWidth: 150,
                    trackWidth: 1350,
                    multiplier: 3,
                }),
                D = (0, h.t6)([]),
                H = (0, h.iN)();
            function B(e) {
                var n;
                let { entity: t } = e,
                    { data: a, loading: v, error: j } = (0, S.Q)({ study: [t.entityID] });
                (0, h.zs)("ld-track", { data: a, loading: v, error: j }, H);
                let R = (0, p.useMemo)(() => {
                        if (!a) return [];
                        let e = new Map();
                        for (let { ldblock: n, chromosome: t, start: r, stop: l } of a)
                            if (e.has(n)) {
                                let t = e.get(n);
                                (t.start = Math.min(t.start, r)), (t.end = Math.max(t.end, l));
                            } else e.set(n, { ldblock: n, chromosome: t, start: r, end: l });
                        return Array.from(e.values());
                    }, [a]),
                    [E, N] = (0, p.useState)(null);
                (0, p.useEffect)(() => {
                    R.length > 0 && !E && N(R[0]);
                }, [R, E]),
                    E && (E.chromosome, E.start, E.end);
                let A = P((e) => e.addHighlight),
                    w = P((e) => e.removeHighlight),
                    T = P((e) => e.setDomain),
                    k = (0, C.useRouter)(),
                    [_, M] = (0, p.useState)(!1),
                    F = () => {
                        M(!_);
                    },
                    B = (0, p.useCallback)(
                        (e) => {
                            let n = e.name;
                            k.push("/GRCh38/ccre/".concat(n));
                        },
                        [k]
                    ),
                    z = (0, p.useCallback)(
                        (e) => {
                            let n = e.name;
                            n.includes("ENSG") || k.push("/GRCh38/gene/".concat(n));
                        },
                        [k]
                    ),
                    L = (0, p.useMemo)(
                        () => [
                            {
                                id: "ld-track",
                                title: "LD",
                                trackType: h.S.LDTrack,
                                displayMode: h.q5.LDBlock,
                                height: 50,
                                titleSize: 12,
                                color: "#ff0000",
                            },
                            {
                                id: "ccre-track",
                                title: "All cCREs colored by group",
                                titleSize: 12,
                                height: 20,
                                color: "#D05F45",
                                trackType: h.S.BigBed,
                                displayMode: h.q5.Dense,
                                url: "https://downloads.wenglab.org/GRCh38-cCREs.DCC.bigBed",
                                onHover: (e) => {
                                    A({
                                        id: e.name + "-temp",
                                        domain: { start: e.start, end: e.end },
                                        color: e.color || "blue",
                                    });
                                },
                                onLeave: (e) => {
                                    w(e.name + "-temp");
                                },
                                onClick: (e) => {
                                    B(e);
                                },
                                tooltip: (e) => (0, r.jsx)(y.A, { assembly: "GRCh38", name: e.name || "", ...e }),
                            },
                            {
                                id: "gene-track",
                                title: "GENCODE genes",
                                titleSize: 12,
                                height: 50,
                                color: "#AAAAAA",
                                trackType: h.S.Transcript,
                                assembly: "GRCh38",
                                version: 40,
                                displayMode: h.q5.Squish,
                                onHover: (e) => {
                                    A({
                                        id: e.name + "-temp",
                                        domain: { start: e.coordinates.start, end: e.coordinates.end },
                                        color: e.color || "blue",
                                    });
                                },
                                onLeave: (e) => {
                                    w(e.name + "-temp");
                                },
                                onClick: (e) => {
                                    z(e);
                                },
                            },
                        ],
                        [A, w, z, B]
                    ),
                    W = D((e) => e.setTracks);
                (0, p.useEffect)(() => {
                    W(L);
                }, [L, W]),
                    (0, p.useEffect)(() => {
                        E && T(G({ chromosome: E.chromosome, start: E.start, end: E.end }));
                    }, [E, T]);
                let $ = D((e) => e.editTrack),
                    q = (0, u.default)(),
                    [O, K] = (0, p.useState)(!1);
                return (0, r.jsxs)(c.A, {
                    container: !0,
                    spacing: 2,
                    sx: { mt: "0rem", mb: "1rem" },
                    justifyContent: "center",
                    alignItems: "center",
                    children: [
                        (0, r.jsxs)(c.A, {
                            size: { xs: 12, lg: 12 },
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "0px",
                            },
                            children: [
                                (0, r.jsxs)(s.default, {
                                    sx: { width: "100%", display: "flex", justifyContent: "space-between", mb: 2 },
                                    children: [
                                        (0, r.jsx)(m.ALD, {
                                            size: "small",
                                            assembly: "GRCh38",
                                            onSearchSubmit: (e) => {
                                                "Gene" === e.type && $("gene-track", { geneName: e.title }),
                                                    A({ domain: e.domain, color: (0, f.XL)(), id: e.title }),
                                                    T(G(e.domain));
                                            },
                                            queries: ["Gene", "SNP", "cCRE", "Coordinate"],
                                            geneLimit: 3,
                                            sx: { width: "400px" },
                                            slots: {
                                                button: (0, r.jsx)(i.A, {
                                                    sx: { color: q.palette.primary.main },
                                                    children: (0, r.jsx)(l.A, {}),
                                                }),
                                            },
                                            slotProps: {
                                                input: {
                                                    label: "Change browser region",
                                                    sx: {
                                                        backgroundColor: "white",
                                                        "& label.Mui-focused": { color: q.palette.primary.main },
                                                        "& .MuiOutlinedInput-root": {
                                                            "&.Mui-focused fieldset": {
                                                                borderColor: q.palette.primary.main,
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        }),
                                        (0, r.jsxs)(s.default, {
                                            display: "flex",
                                            gap: 2,
                                            children: [
                                                (0, r.jsx)(o.default, {
                                                    variant: "contained",
                                                    startIcon: (0, r.jsx)(d.A, {}),
                                                    size: "small",
                                                    onClick: () => F(),
                                                    children: "Select Ld Block",
                                                }),
                                                (0, r.jsx)(I, {
                                                    open: _,
                                                    setOpen: F,
                                                    onLdBlockSelect: (e) => {
                                                        N(e);
                                                    },
                                                    ldblockList: R,
                                                    ldblock: null != E ? E : null,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                (0, r.jsx)(b.A, { browserStore: P, assembly: "GRCh38" }),
                                (0, r.jsx)(g.A, { browserStore: P }),
                            ],
                        }),
                        (0, r.jsx)(c.A, {
                            size: { xs: 12, lg: 12 },
                            children: (0, r.jsx)(
                                h.Pw,
                                { browserStore: P, trackStore: D, externalDataStore: H },
                                null != (n = null == E ? void 0 : E.ldblock) ? n : "default"
                            ),
                        }),
                        (0, r.jsx)(x.A, { open: O, setOpen: K, browserStore: P }),
                    ],
                });
            }
            (0, M.J1)(F());
        },
        66645: (e, n, t) => {
            t.d(n, { default: () => c });
            var a = t(95155),
                r = t(80317),
                l = t(52403),
                s = t(51760),
                i = t(83982),
                o = t(1684);
            let c = (e) => {
                let { entity: n } = e,
                    {
                        data: t,
                        loading: c,
                        error: d,
                    } = (0, l.V)({ coordinates: (0, o.oE)(n.entityID), assembly: n.assembly }),
                    u = [
                        {
                            field: "name",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Symbol" }) }),
                            renderCell: (e) =>
                                (0, a.jsx)(s.g, {
                                    href: "/".concat(n.assembly, "/gene/").concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "id",
                            renderHeader: () => (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "ID" }) }),
                        },
                        {
                            field: "strand",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Strand" }) }),
                        },
                        {
                            field: "coordinates.chromosome",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Chromosome" }) }),
                            valueGetter: (e, n) => n.coordinates.chromosome,
                        },
                        {
                            field: "coordinates.start",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Start" }) }),
                            valueGetter: (e, n) => n.coordinates.start,
                        },
                        {
                            field: "coordinates.end",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "End" }) }),
                            valueGetter: (e, n) => n.coordinates.end,
                        },
                    ];
                return d
                    ? (0, a.jsx)(r.default, { children: "Error Fetching Genes" })
                    : (0, a.jsx)(i.XIK, {
                          showToolbar: !0,
                          rows: t,
                          columns: u,
                          loading: c,
                          error: !!d,
                          label: "Intersecting Genes",
                          emptyTableFallback: "No intersecting Genes found in this region",
                          divHeight: { maxHeight: "600px" },
                      });
            };
        },
        67592: (e, n, t) => {
            // el is undefined here
            t.d(n, { BiosampleActivity: () => el });
            var a = t(95155),
                r = t(12115),
                l = t(40650),
                s = t(59300),
                i = t(75416),
                o = t(96869),
                c = t(81362),
                d = t(83982),
                u = t(94434),
                h = t(82293),
                m = t(1684),
                p = t(36822),
                g = t(78062),
                x = t(58552),
                f = t(18058),
                C = t(25789),
                y = t(28278),
                b = t(79194),
                S = t(77406);
            let v = (e) => {
                    let n = { ontology: !1, sampleType: !1, lifeStage: !1, tf: !1 };
                    return (
                        S.Bx.forEach((t) => {
                            t !== e && Object.defineProperty(n, t, { value: !1, enumerable: !0 });
                        }),
                        n
                    );
                },
                j = (e) => {
                    let {
                            entity: n,
                            rows: t,
                            columns: l,
                            assay: s,
                            selected: i,
                            setSelected: o,
                            sortedFilteredData: c,
                            setSortedFilteredData: u,
                            viewBy: h,
                        } = e,
                        [p, g] = (0, r.useState)(!1),
                        x = (0, C.default)(),
                        f = (0, y.A)(x.breakpoints.down("sm")),
                        S = (0, r.useMemo)(() => {
                            if (!t) return [];
                            let e = t;
                            switch (h) {
                                case "value":
                                    e.sort((e, n) => n[s] - e[s]);
                                    break;
                                case "tissue": {
                                    let n = (e) => {
                                            var n;
                                            return null != (n = e.ontology) ? n : "unknown";
                                        },
                                        t = e.reduce((e, t) => {
                                            var a;
                                            let r = n(t);
                                            return (e[r] = Math.max(null != (a = e[r]) ? a : -1 / 0, t[s])), e;
                                        }, {});
                                    e.sort((e, a) => {
                                        let r = n(e),
                                            l = t[n(a)] - t[r];
                                        return 0 !== l ? l : a[s] - e[s];
                                    });
                                    break;
                                }
                                case "tissueMax": {
                                    let n = (e) => {
                                            var n;
                                            return null != (n = e.ontology) ? n : "unknown";
                                        },
                                        t = e.reduce((e, t) => {
                                            var a;
                                            let r = n(t);
                                            return (e[r] = Math.max(null != (a = e[r]) ? a : -1 / 0, t[s])), e;
                                        }, {});
                                    (e = e.filter((e) => {
                                        let a = n(e);
                                        return e[s] === t[a];
                                    })).sort((e, n) => n[s] - e[s]);
                                }
                            }
                            return [...e];
                        }, [t, h, s]),
                        j = (0, d.bBi)(),
                        R = (0, r.useCallback)(() => {
                            if (!j.current) return;
                            let e = (0, d.oU)(j).map((e) => e.model);
                            ((e, n) => {
                                if (e.length !== n.length || JSON.stringify(e[0]) !== JSON.stringify(n[0])) return !1;
                                for (let t = 0; t < e.length; t++) if (e[t].name !== n[t].name) return !1;
                                return !0;
                            })(c, e) || u(e);
                        }, [j, u, c]),
                        E = (0, r.useMemo)(() => ({ type: "include", ids: new Set(i.map((e) => e.name)) }), [i]);
                    (0, r.useEffect)(() => {
                        j.current && (j.current.setColumnVisibilityModel(v(s)), j.current.sortColumn(s, "desc"));
                    }, [j, s]);
                    let N = (0, r.useMemo)(() => (0, a.jsx)(b.A, { autoSort: p, setAutoSort: g }), [p]),
                        A = (0, r.useMemo)(() => [{ field: s, sort: "desc" }], [s]);
                    return (
                        (0, r.useEffect)(() => {
                            let e = null == j ? void 0 : j.current;
                            if (!e) return;
                            let n = (null == i ? void 0 : i.length) > 0;
                            return "tissue" === h
                                ? void (p && n
                                      ? e.setSortModel([{ field: "__check__", sort: "desc" }])
                                      : e.setSortModel([]))
                                : p
                                  ? void e.setSortModel(n ? [{ field: "__check__", sort: "desc" }] : A)
                                  : void e.setSortModel(A);
                        }, [j, p, A, i, h]),
                        (0, r.useEffect)(() => {
                            if (!j.current) return;
                            let e = requestAnimationFrame(() => {
                                var e;
                                null == (e = j.current) ||
                                    e.autosizeColumns({ expand: !0, includeHeaders: !0, outliersFactor: 1.5 });
                            });
                            return () => cancelAnimationFrame(e);
                        }, [j, s]),
                        (0, a.jsx)(d.XIK, {
                            label: "".concat(n.entityID, " ").concat((0, m.XZ)(s), " z-scores"),
                            rows: S,
                            loading: !t,
                            columns: l,
                            apiRef: j,
                            checkboxSelection: !0,
                            getRowId: (e) => e.name,
                            onRowSelectionModelChange: (e) => {
                                "include" === e.type
                                    ? o(Array.from(e.ids).map((e) => t.find((n) => n.name === e)))
                                    : o(t);
                            },
                            rowSelectionModel: E,
                            keepNonExistentRowsSelected: !0,
                            onStateChange: R,
                            divHeight: { height: "100%", minHeight: f ? "none" : "580px" },
                            initialState: { columns: { columnVisibilityModel: v(s) }, sorting: { sortModel: A } },
                            toolbarSlot: N,
                        })
                    );
                };
            var R = t(80010),
                E = t(93320),
                N = t(80317),
                A = t(62995),
                w = t(22585),
                T = t(71583),
                k = t(35497);
            let _ = (e) => {
                    let {
                        viewBy: n,
                        setViewBy: t,
                        setSortBy: r = () => {},
                        sortBy: l = "median",
                        violin: s = !1,
                        setShowPoints: i = () => {},
                        showPoints: c = !0,
                    } = e;
                    return (0, a.jsxs)(o.default, {
                        direction: "row",
                        spacing: 2,
                        alignItems: "center",
                        mb: 2,
                        children: [
                            !s &&
                                (0, a.jsxs)(A.A, {
                                    children: [
                                        (0, a.jsx)(w.A, { children: "View By" }),
                                        (0, a.jsxs)(T.A, {
                                            color: "primary",
                                            value: n,
                                            exclusive: !0,
                                            onChange: (e, n) => {
                                                null !== n && t(n);
                                            },
                                            "aria-label": "View By",
                                            size: "small",
                                            children: [
                                                (0, a.jsx)(k.A, {
                                                    sx: { textTransform: "none" },
                                                    value: "value",
                                                    children: "Value",
                                                }),
                                                (0, a.jsx)(k.A, {
                                                    sx: { textTransform: "none" },
                                                    value: "tissue",
                                                    children: "Tissue",
                                                }),
                                                (0, a.jsx)(k.A, {
                                                    sx: { textTransform: "none" },
                                                    value: "tissueMax",
                                                    children: "Tissue Max",
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            s &&
                                (0, a.jsxs)(o.default, {
                                    direction: "row",
                                    spacing: 2,
                                    alignItems: "center",
                                    children: [
                                        (0, a.jsxs)(A.A, {
                                            children: [
                                                (0, a.jsx)(w.A, { children: "Sort By" }),
                                                (0, a.jsxs)(T.A, {
                                                    color: "primary",
                                                    value: l,
                                                    exclusive: !0,
                                                    onChange: (e, n) => {
                                                        null !== n && r(n);
                                                    },
                                                    "aria-label": "View By",
                                                    size: "small",
                                                    children: [
                                                        (0, a.jsx)(k.A, {
                                                            sx: { textTransform: "none" },
                                                            value: "max",
                                                            children: "Max",
                                                        }),
                                                        (0, a.jsx)(k.A, {
                                                            sx: { textTransform: "none" },
                                                            value: "median",
                                                            children: "Median",
                                                        }),
                                                        (0, a.jsx)(k.A, {
                                                            sx: { textTransform: "none" },
                                                            value: "tissue",
                                                            children: "Tissue",
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                        (0, a.jsxs)(A.A, {
                                            children: [
                                                (0, a.jsx)(w.A, { children: "Show Points" }),
                                                (0, a.jsxs)(T.A, {
                                                    color: "primary",
                                                    value: c,
                                                    exclusive: !0,
                                                    onChange: (e, n) => {
                                                        null !== n && i(n);
                                                    },
                                                    "aria-label": "show points",
                                                    size: "small",
                                                    children: [
                                                        (0, a.jsx)(k.A, {
                                                            sx: { textTransform: "none" },
                                                            value: !0,
                                                            children: "On",
                                                        }),
                                                        (0, a.jsx)(k.A, {
                                                            sx: { textTransform: "none" },
                                                            value: !1,
                                                            children: "Off",
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                        ],
                    });
                },
                I = (e) => {
                    let {
                            entity: n,
                            assay: t,
                            selected: l,
                            setSelected: s,
                            sortedFilteredData: i,
                            viewBy: o,
                            ref: c,
                            setViewBy: d,
                        } = e,
                        h = (0, r.useMemo)(
                            () =>
                                i
                                    ? i.map((e) => {
                                          var n;
                                          let a = l.length > 0,
                                              r = l.some((n) => n.name === e.name);
                                          return {
                                              value: e[t],
                                              id: e.name,
                                              category: (0, m.Zr)(e.ontology),
                                              label: (0, m.W5)((0, m.Zr)(e.displayname), 25),
                                              color:
                                                  (a && r) || !a
                                                      ? null != (n = u.Me[e.ontology])
                                                          ? n
                                                          : u.Me.missing
                                                      : "#CCCCCC",
                                              metadata: e,
                                          };
                                      })
                                    : [],
                            [t, l, i]
                        );
                    return (0, a.jsxs)(R.default, {
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                        padding: 1,
                        sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" },
                        children: [
                            (0, a.jsx)(_, { viewBy: o, setViewBy: d }),
                            (0, a.jsx)(E.bH, {
                                data: h,
                                topAxisLabel: "".concat(n.entityID, " ").concat((0, m.XZ)(t), " z-scores"),
                                cutoffNegativeValues: !0,
                                onBarClicked: (e) => {
                                    l.includes(e.metadata)
                                        ? s(l.filter((n) => n.name !== e.metadata.name))
                                        : s([...l, e.metadata]);
                                },
                                TooltipContents: (e) =>
                                    (0, a.jsxs)(R.default, {
                                        maxWidth: 350,
                                        children: [
                                            (0, a.jsxs)(N.default, {
                                                variant: "body2",
                                                children: [
                                                    (0, a.jsx)("b", { children: "Sample:" }),
                                                    " ",
                                                    (0, m.Zr)(e.metadata.displayname),
                                                ],
                                            }),
                                            (0, a.jsxs)(N.default, {
                                                variant: "body2",
                                                children: [
                                                    (0, a.jsx)("b", { children: "Tissue:" }),
                                                    " ",
                                                    (0, m.Zr)(e.metadata.ontology),
                                                ],
                                            }),
                                            (0, a.jsxs)(N.default, {
                                                variant: "body2",
                                                children: [
                                                    (0, a.jsx)("b", { children: "Classification:" }),
                                                    " ",
                                                    (0, m.Zr)(e.metadata.class),
                                                ],
                                            }),
                                            (0, a.jsxs)(N.default, {
                                                variant: "body2",
                                                children: [
                                                    (0, a.jsx)("b", { children: "Z-Score" }),
                                                    " ",
                                                    e.value.toFixed(2),
                                                ],
                                            }),
                                        ],
                                    }),
                                ref: c,
                                downloadFileName: "".concat(t, "_bar_plot"),
                            }),
                        ],
                    });
                },
                M = (e) => {
                    let {
                            entity: n,
                            rows: t,
                            assay: l,
                            selected: s,
                            setSelected: i,
                            viewBy: o,
                            setViewBy: c,
                            ref: d,
                        } = e,
                        [h, p] = (0, r.useState)("max"),
                        [g, x] = (0, r.useState)(!0),
                        f = (0, r.useMemo)(() => {
                            if (!t) return [];
                            let e = Object.entries(
                                t.reduce((e, n) => {
                                    let t = n.ontology;
                                    return e[t] || (e[t] = []), e[t].push(n), e;
                                }, {})
                            ).map((e) => {
                                var n;
                                let [t, a] = e,
                                    r = (0, m.Zr)(t),
                                    i = (e) => s.some((n) => n.name === e.name),
                                    o = 0 === s.length,
                                    c = a.every((e) => s.some((n) => n.name === e.name)),
                                    d = o || c ? (null != (n = u.Me[t]) ? n : u.Me.missing) : "#CCCCCC";
                                return {
                                    label: r,
                                    data: a
                                        .map((e) => {
                                            var n, a;
                                            let r = o || i(e) ? (null != (n = u.Me[t]) ? n : u.Me.missing) : "#CCCCCC",
                                                s = i(e) ? 4 : 2;
                                            return {
                                                value: null != (a = e[l]) ? a : 0,
                                                radius: s,
                                                tissue: t,
                                                metadata: e,
                                                color: r,
                                            };
                                        })
                                        .sort((e, n) => (i(n.metadata) ? -1 : 0)),
                                    violinColor: d,
                                };
                            });
                            return (
                                e.sort((e, n) => {
                                    if ("tissue" === h) return e.label.localeCompare(n.label);
                                    if ("median" === h) {
                                        let t = (e) => {
                                            let n = [...e].sort((e, n) => e - n),
                                                t = Math.floor(n.length / 2);
                                            return n.length % 2 != 0 ? n[t] : (n[t - 1] + n[t]) / 2;
                                        };
                                        return t(n.data.map((e) => e.value)) - t(e.data.map((e) => e.value));
                                    }
                                    return "max" === h
                                        ? Math.max(...n.data.map((e) => e.value)) -
                                              Math.max(...e.data.map((e) => e.value))
                                        : 0;
                                }),
                                e
                            );
                        }, [l, s, t, h]);
                    return (0, a.jsxs)(R.default, {
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                        padding: 1,
                        sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" },
                        children: [
                            (0, a.jsx)(_, {
                                viewBy: o,
                                setViewBy: c,
                                violin: !0,
                                sortBy: h,
                                setSortBy: p,
                                showPoints: g,
                                setShowPoints: x,
                            }),
                            (0, a.jsx)(R.default, {
                                width: "100%",
                                height: "calc(100% - 63px)",
                                children: (0, a.jsx)(E.Dq, {
                                    distributions: f,
                                    axisLabel: "".concat(n.entityID, " ").concat((0, m.XZ)(l), " z-scores"),
                                    loading: !f.length,
                                    onViolinClicked: (e) => {
                                        let n = e.data.map((e) => e.metadata);
                                        if (n.every((e) => s.some((n) => n.name === e.name)))
                                            i((e) => e.filter((e) => !n.some((n) => n.name === e.name)));
                                        else {
                                            let e = n.filter((e) => !s.some((n) => n.name === e.name));
                                            i((n) => [...n, ...e]);
                                        }
                                    },
                                    onPointClicked: (e) => {
                                        s.includes(e.metadata)
                                            ? i(s.filter((n) => n.name !== e.metadata.name))
                                            : i([...s, e.metadata]);
                                    },
                                    labelOrientation: "leftDiagonal",
                                    violinProps: { bandwidth: "scott", showAllPoints: g, jitter: 10 },
                                    crossProps: { outliers: g ? "all" : "none" },
                                    ref: d,
                                    downloadFileName: "".concat(l, "_violin_plot"),
                                    pointTooltipBody: (e) => {
                                        var n, t, r, s;
                                        return (0, a.jsxs)(R.default, {
                                            maxWidth: 300,
                                            children: [
                                                e.outlier &&
                                                    (0, a.jsx)("div", {
                                                        children: (0, a.jsx)("strong", { children: "Outlier" }),
                                                    }),
                                                (0, a.jsxs)("div", {
                                                    children: [
                                                        (0, a.jsx)("strong", { children: "Sample:" }),
                                                        " ",
                                                        null == (n = e.metadata) ? void 0 : n.displayname,
                                                    ],
                                                }),
                                                (0, a.jsxs)("div", {
                                                    children: [
                                                        (0, a.jsx)("strong", { children: "Organ/Tissue:" }),
                                                        " ",
                                                        null == (t = e.metadata) ? void 0 : t.ontology,
                                                    ],
                                                }),
                                                (0, a.jsxs)("div", {
                                                    children: [
                                                        (0, a.jsx)("strong", { children: "Sample Type:" }),
                                                        " ",
                                                        null == (r = e.metadata) ? void 0 : r.sampleType,
                                                    ],
                                                }),
                                                (0, a.jsxs)("div", {
                                                    children: [
                                                        (0, a.jsxs)("strong", {
                                                            children: [(0, m.XZ)(l), " z-score:"],
                                                        }),
                                                        " ",
                                                        e.metadata[l],
                                                    ],
                                                }),
                                                (0, a.jsxs)("div", {
                                                    children: [
                                                        (0, a.jsx)("strong", { children: "Class in this sample:" }),
                                                        " ",
                                                        null == (s = e.metadata) ? void 0 : s.class,
                                                    ],
                                                }),
                                            ],
                                        });
                                    },
                                }),
                            }),
                        ],
                    });
                };
            var F = t(27441),
                G = t(44177),
                P = t(51404),
                D = t(23405),
                H = t(56919),
                B = t(7291),
                z = t(1123),
                L = t(20146),
                W = t(53305),
                $ = t(50381);
            let q = (0, c.J1)(
                    "\n  query BiosampleUmap($assembly: String!, $assay: String!) {\n    ccREBiosampleQuery(assay: [$assay], assembly: $assembly) {\n      biosamples {\n        name\n        umap_coordinates(assay: $assay)\n      }\n    }\n  }\n"
                ),
                O = (e) => {
                    let { metaData: n, assay: t } = e;
                    return (0, a.jsxs)(a.Fragment, {
                        children: [
                            (0, a.jsxs)(N.default, {
                                children: [(0, a.jsx)("b", { children: "Sample:" }), " ", n.displayname],
                            }),
                            (0, a.jsxs)(N.default, {
                                children: [(0, a.jsx)("b", { children: "Organ/Tissue:" }), " ", n.ontology],
                            }),
                            (0, a.jsxs)(N.default, {
                                children: [(0, a.jsx)("b", { children: "Sample Type:" }), " ", n.sampleType],
                            }),
                            (0, a.jsxs)(N.default, {
                                children: [(0, a.jsxs)("b", { children: [(0, m.XZ)(t), ":"] }), " ", n[t]],
                            }),
                        ],
                    });
                },
                K = (e) => {
                    let { entity: n, rows: t, assay: s, selected: i, setSelected: o, ref: c } = e,
                        [d, h] = (0, r.useState)("score"),
                        [m, p] = (0, r.useState)("active"),
                        {
                            data: g,
                            loading: x,
                            error: f,
                        } = (0, l.IT)(q, { variables: { assembly: n.assembly.toLowerCase(), assay: s } }),
                        C = (0, r.useMemo)(() => {
                            let e;
                            switch (m) {
                                case "active":
                                    e = { domain: [1.64, 1.640000001, 4], range: ["#DDD", (0, W.A)(0.5), (0, W.A)(0)] };
                                    break;
                                case "all":
                                    e = { domain: [-4, 0, 4], range: [(0, W.A)(1), (0, W.A)(0.5), (0, W.A)(0)] };
                            }
                            return (0, L.A)({ ...e, clamp: !0 });
                        }, [m]),
                        y = (0, r.useCallback)(
                            (e) => {
                                var n, t;
                                switch (d) {
                                    case "score":
                                        return C(e[s]);
                                    case "organ/tissue":
                                        return null != (n = u.Me[e.ontology]) ? n : u.Me.missing;
                                    case "sampleType":
                                        return null != (t = u.Me[e.sampleType]) ? t : u.Me.missing;
                                }
                            },
                            [s, C, d]
                        ),
                        b = (0, r.useMemo)(() => {
                            if (!t || !g || !C) return [];
                            let e = (e) => i.some((n) => n.name === e.name);
                            return t
                                .map((n) => {
                                    var t, a, r;
                                    let l =
                                        null == (t = g.ccREBiosampleQuery.biosamples.find((e) => e.name === n.name))
                                            ? void 0
                                            : t.umap_coordinates;
                                    return {
                                        x: null != (a = l[0]) ? a : 0,
                                        y: null != (r = l[1]) ? r : 0,
                                        shape: "circle",
                                        r: e(n) ? 4 : 2,
                                        color: e(n) || 0 === i.length ? y(n) : "#CCCCCC",
                                        metaData: n,
                                    };
                                })
                                .sort((e, n) => e.metaData[s] - n.metaData[s])
                                .sort((n, t) => (e(t.metaData) ? -1 : 0));
                        }, [t, g, C, i, y, s]);
                    return (0, a.jsxs)(F.default, {
                        width: "100%",
                        height: "100%",
                        padding: 1,
                        sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" },
                        children: [
                            (0, a.jsxs)(F.default, {
                                direction: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                children: [
                                    (0, a.jsxs)(F.default, {
                                        direction: "row",
                                        spacing: 1,
                                        children: [
                                            (0, a.jsxs)(A.A, {
                                                children: [
                                                    (0, a.jsx)(G.A, {
                                                        id: "demo-simple-select-label",
                                                        children: "Color By",
                                                    }),
                                                    (0, a.jsxs)(P.A, {
                                                        value: d,
                                                        label: "Color By",
                                                        onChange: (e) => {
                                                            h(e.target.value);
                                                        },
                                                        size: "small",
                                                        children: [
                                                            (0, a.jsx)(D.A, { value: "score", children: "Z Score" }),
                                                            (0, a.jsx)(D.A, {
                                                                value: "organ/tissue",
                                                                children: "Organ/Tissue",
                                                            }),
                                                            (0, a.jsx)(D.A, {
                                                                value: "sampleType",
                                                                children: "Sample Type",
                                                            }),
                                                        ],
                                                    }),
                                                ],
                                            }),
                                            "score" === d &&
                                                (0, a.jsx)(A.A, {
                                                    children: (0, a.jsxs)(H.A, {
                                                        value: m,
                                                        onChange: (e) => {
                                                            p(e.target.value);
                                                        },
                                                        row: !0,
                                                        children: [
                                                            (0, a.jsx)(B.A, {
                                                                value: "active",
                                                                control: (0, a.jsx)(z.A, {}),
                                                                label: "Active Only",
                                                            }),
                                                            (0, a.jsx)(B.A, {
                                                                value: "all",
                                                                control: (0, a.jsx)(z.A, {}),
                                                                label: "All",
                                                            }),
                                                        ],
                                                    }),
                                                }),
                                        ],
                                    }),
                                    (0, a.jsx)($.A, {
                                        colorScheme: d,
                                        scatterData: b,
                                        maxValue: 4,
                                        colorScale: C,
                                        scoreColorMode: m,
                                    }),
                                ],
                            }),
                            (0, a.jsx)(R.default, {
                                sx: { flexGrow: 1 },
                                children: (0, a.jsx)(E.IG, {
                                    pointData: b,
                                    onPointClicked: (e) => {
                                        i.includes(e.metaData)
                                            ? o(i.filter((n) => n.name !== e.metaData.name))
                                            : o([...i, e.metaData]);
                                    },
                                    onSelectionChange: (e) => {
                                        o((n) => [...n, ...e.map((e) => e.metaData)]);
                                    },
                                    leftAxisLabel: "UMAP-2",
                                    bottomAxisLabel: "UMAP-1",
                                    selectable: !0,
                                    loading: x,
                                    miniMap: { position: { right: 50, bottom: 50 } },
                                    tooltipBody: (e) => (0, a.jsx)(O, { metaData: e.metaData, assay: s }),
                                    ref: c,
                                    downloadFileName: "".concat(s, "_UMAP"),
                                }),
                            }),
                        ],
                    });
                },
                Q = (e) => {
                    let [n, t] = (0, r.useState)([]),
                        [l, s] = (0, r.useState)([]),
                        [i, o] = (0, r.useState)("value"),
                        c = (0, r.useRef)(null),
                        d = (0, r.useRef)(null),
                        u = (0, r.useRef)(null);
                    (0, r.useEffect)(() => {
                        e.assay && t([]);
                    }, [e.assay]);
                    let h = (0, r.useMemo)(
                            () => ({
                                selected: n,
                                setSelected: t,
                                sortedFilteredData: l,
                                setSortedFilteredData: s,
                                viewBy: i,
                                setViewBy: o,
                                ...e,
                            }),
                            [e, n, l, i]
                        ),
                        m = (0, r.useMemo)(() => {
                            let n = [
                                {
                                    tabTitle: "Bar Plot",
                                    icon: (0, a.jsx)(g.A, {}),
                                    plotComponent: (0, a.jsx)(I, { ref: c, ...h }),
                                    ref: c,
                                },
                                {
                                    tabTitle: "Violin Plot",
                                    icon: (0, a.jsx)(x.A, {}),
                                    plotComponent: (0, a.jsx)(M, { ref: d, ...h }),
                                    ref: d,
                                },
                            ];
                            return (
                                "atac" !== e.assay &&
                                    n.push({
                                        tabTitle: "UMAP",
                                        icon: (0, a.jsx)(f.A, {}),
                                        plotComponent: (0, a.jsx)(K, { ref: u, ...h }),
                                        ref: u,
                                    }),
                                n
                            );
                        }, [e.assay, h]);
                    return (0, a.jsx)(p.A, { TableComponent: (0, a.jsx)(j, { ...h }), plots: m });
                };
            var Z = t(39715);
            let V = {
                    valueGetter: (e) => (-11 === e ? "NA" : e.toFixed(2)),
                    renderCell: (e) => ((e) => ("NA" === e ? "--" : e))(e.value),
                    sortComparator: (e, n) => ("NA" === e ? -1 : "NA" === n ? 1 : e - n),
                    type: "number",
                },
                J = {
                    renderCell: (e) => {
                        let n = e.value,
                            t = u.N8.get(n),
                            r = t ? ("InActive" === n ? "gray" : t.split(":")[1]) : "#06da93",
                            l = t ? t.split(":")[0] : "DNase only";
                        return (0, a.jsx)("span", {
                            style: { color: r },
                            children: (0, a.jsx)("strong", { children: l }),
                        });
                    },
                },
                U = [
                    { headerName: "DNase max-Z", field: "dnase", ...V },
                    { headerName: "ATAC max-Z", field: "atac", ...V },
                    { headerName: "H3K4me3 max-Z", field: "h3k4me3", ...V },
                    { headerName: "H3K27ac max-Z", field: "h3k27ac", ...V },
                    { headerName: "CTCF max-Z", field: "ctcf", ...V },
                    { headerName: "Classification", field: "group", ...J },
                ],
                X = (e) =>
                    (0, a.jsx)("div", {
                        id: "StopPropagationWrapper",
                        onClick: (e) => e.stopPropagation(),
                        children: (0, a.jsx)(d.fgx.renderHeader, { ...e }),
                    }),
                Y = () => [
                    { ...d.fgx, sortable: !0, hideable: !1, renderHeader: X },
                    { headerName: "Cell Type", field: "displayname", maxWidth: 400, valueFormatter: m.Zr },
                    { headerName: "Organ/Tissue", field: "ontology", valueFormatter: m.Zr },
                    { headerName: "Sample Type", field: "sampleType", valueFormatter: m.Zr },
                    { headerName: "Life Stage", field: "lifeStage" },
                    { headerName: "DNase", field: "dnase", ...V },
                    { headerName: "ATAC", field: "atac", ...V },
                    { headerName: "H3K4me3", field: "h3k4me3", ...V },
                    { headerName: "H3K27ac", field: "h3k27ac", ...V },
                    { headerName: "CTCF", field: "ctcf", ...V },
                    {
                        headerName: "TF",
                        field: "tf",
                        valueGetter: (e) => (void 0 === e ? "--" : "1" === e ? "Yes" : "No"),
                    },
                    { headerName: "Classification", field: "class", ...J },
                    {
                        headerName: "Assays",
                        field: " ",
                        type: "number",
                        valueGetter: (e, n) => Object.values(ee(n)).filter((e) => e).length,
                        renderCell: (e) => (0, a.jsx)(Z.L, { row: ee(e.row) }),
                    },
                ],
                ee = (e) => ({
                    dnase: e.dnaseAccession,
                    atac: e.atacAccession,
                    h3k4me3: e.h3k4me3Accession,
                    h3k27ac: e.h3k27acAccession,
                    ctcf: e.ctcfAccession,
                }),
                en = (0, c.J1)(
                    "\n  query cCRETF($accession: String!, $assembly: String!) {\n    getcCRETFQuery(accession: $accession, assembly: $assembly) {\n      celltype\n      tf\n    }\n  }\n"
                ),
                et = (0, c.J1)(
                    "\n  query biosampleZScores($accession: [String!], $assembly: String!) {\n    ccREBiosampleQuery(assembly: $assembly) {\n      biosamples {\n        id: name  # Add a unique identifier for each biosample\n        sampleType\n        displayname\n        lifeStage\n        cCREZScores(accession: $accession) @nonreactive {  # Mark this field as non-reactive to prevent unnecessary re-renders\n          score\n          assay\n          experiment_accession\n        }\n        name\n        ontology\n      }\n    }\n  }\n"
                ),
                ea = (0, c.J1)(
                    '\n  query CtAgnostic($accession: [String!], $assembly: String!) {\n    cCREQuery(assembly: $assembly, accession: $accession) {\n      id: accession  # Add a unique identifier for the cCRE\n      accession\n      group\n      dnase: maxZ(assay: "DNase")\n      h3k4me3: maxZ(assay: "H3K4me3")\n      h3k27ac: maxZ(assay: "H3K27ac")\n      ctcf: maxZ(assay: "CTCF")\n      atac: maxZ(assay: "ATAC")\n    }\n  }\n'
                ),
                er = (0, c.J1)(
                    "\n  query nearbyGenes(\n    $assembly: String!\n    $geneSearchStart: Int!\n    $geneSearchEnd: Int!\n    $geneSearchChrom: String!\n    $geneVersion: Int!\n  ) {\n    nearbyGenes: gene(\n      chromosome: $geneSearchChrom\n      start: $geneSearchStart\n      end: $geneSearchEnd\n      assembly: $assembly\n      version: $geneVersion\n    ) {\n      name\n      id\n      gene_type\n      strand\n      coordinates {\n        chromosome\n        start\n        end\n      }\n      transcripts {\n        id\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n  }\n"
                ),
                // defined here
                el = (e) => {
                    let { entity: n } = e,
                        [t, c] = (0, r.useState)("tables"),
                        { data: p, loading: g, error: x } = (0, h.H)({ accession: n.entityID, assembly: n.assembly }),
                        f = {
                            chromosome: null == p ? void 0 : p.chrom,
                            start: null == p ? void 0 : p.start,
                            end: (null == p ? void 0 : p.start) + (null == p ? void 0 : p.len),
                        },
                        {
                            data: C,
                            loading: y,
                            error: b,
                        } = (0, l.IT)(ea, { variables: { assembly: n.assembly.toLowerCase(), accession: n.entityID } }),
                        {
                            data: v,
                            loading: j,
                            error: R,
                        } = (0, l.IT)(et, { variables: { assembly: n.assembly.toLowerCase(), accession: n.entityID } }),
                        {
                            data: N,
                            loading: A,
                            error: w,
                        } = (0, l.IT)(en, {
                            variables: {
                                assembly: "mm10" === n.assembly.toLowerCase() ? "mm10" : "GRCh38",
                                accession: n.entityID,
                            },
                        }),
                        {
                            loading: T,
                            data: k,
                            error: _,
                        } = (0, l.IT)(er, {
                            variables: {
                                assembly: n.assembly.toLowerCase(),
                                geneSearchChrom: f.chromosome,
                                geneSearchStart: f.start - 1e6,
                                geneSearchEnd: f.end + 1e6,
                                geneVersion: "GRCh38" === n.assembly ? 40 : 25,
                            },
                            skip: !p,
                        }),
                        I =
                            null == k
                                ? void 0
                                : k.nearbyGenes.map((e) => ({
                                      ...e,
                                      distanceToTSS: (0, m.sz)(f, e.transcripts, e.strand, "middle").distance,
                                      overlapsTSS: (0, m.ew)(f, e.transcripts, e.strand),
                                  })),
                        M = null == I ? void 0 : I.sort((e, n) => e.distanceToTSS - n.distanceToTSS)[0].distanceToTSS,
                        F = null == I ? void 0 : I.some((e) => e.overlapsTSS),
                        G = (0, r.useMemo)(
                            () =>
                                v && N
                                    ? null == v
                                        ? void 0
                                        : v.ccREBiosampleQuery.biosamples.map((e) => {
                                              var n, t, a, r, l, s, i, o, c, d, u;
                                              let h =
                                                      (null ==
                                                      (n = e.cCREZScores.find((e) => "dnase" === e.assay.toLowerCase()))
                                                          ? void 0
                                                          : n.score) || -11,
                                                  m =
                                                      null ==
                                                      (t = e.cCREZScores.find((e) => "dnase" === e.assay.toLowerCase()))
                                                          ? void 0
                                                          : t.experiment_accession,
                                                  p =
                                                      (null ==
                                                      (a = e.cCREZScores.find((e) => "atac" === e.assay.toLowerCase()))
                                                          ? void 0
                                                          : a.score) || -11,
                                                  g =
                                                      null ==
                                                      (r = e.cCREZScores.find((e) => "atac" === e.assay.toLowerCase()))
                                                          ? void 0
                                                          : r.experiment_accession,
                                                  x =
                                                      (null ==
                                                      (l = e.cCREZScores.find(
                                                          (e) => "h3k4me3" === e.assay.toLowerCase()
                                                      ))
                                                          ? void 0
                                                          : l.score) || -11,
                                                  f =
                                                      null ==
                                                      (s = e.cCREZScores.find(
                                                          (e) => "h3k4me3" === e.assay.toLowerCase()
                                                      ))
                                                          ? void 0
                                                          : s.experiment_accession,
                                                  C =
                                                      (null ==
                                                      (i = e.cCREZScores.find(
                                                          (e) => "h3k27ac" === e.assay.toLowerCase()
                                                      ))
                                                          ? void 0
                                                          : i.score) || -11,
                                                  y =
                                                      null ==
                                                      (o = e.cCREZScores.find(
                                                          (e) => "h3k27ac" === e.assay.toLowerCase()
                                                      ))
                                                          ? void 0
                                                          : o.experiment_accession,
                                                  b =
                                                      (null ==
                                                      (c = e.cCREZScores.find((e) => "ctcf" === e.assay.toLowerCase()))
                                                          ? void 0
                                                          : c.score) || -11,
                                                  S = {
                                                      dnase: h,
                                                      dnaseAccession: m,
                                                      atac: p,
                                                      atacAccession: g,
                                                      h3k4me3: x,
                                                      h3k4me3Accession: f,
                                                      h3k27ac: C,
                                                      h3k27acAccession: y,
                                                      ctcf: b,
                                                      ctcfAccession:
                                                          null ==
                                                          (d = e.cCREZScores.find(
                                                              (e) => "ctcf" === e.assay.toLowerCase()
                                                          ))
                                                              ? void 0
                                                              : d.experiment_accession,
                                                      tf:
                                                          null ==
                                                          (u = N.getcCRETFQuery.find((n) => e.name === n.celltype))
                                                              ? void 0
                                                              : u.tf.toString(),
                                                  },
                                                  v = ((e, n, t) => {
                                                      let a;
                                                      return (
                                                          -11 != e.dnase
                                                              ? e.dnase > 1.64
                                                                  ? e.h3k4me3 > 1.64
                                                                      ? n <= 200 || t
                                                                          ? (a = "PLS")
                                                                          : e.h3k27ac <= 1.64 && n > 200
                                                                            ? (a = "CA-H3K4me3")
                                                                            : n <= 2e3 && e.h3k27ac > 1.64
                                                                              ? (a = "pELS")
                                                                              : n > 2e3 &&
                                                                                e.h3k27ac > 1.64 &&
                                                                                (a = "dELS")
                                                                      : e.h3k27ac > 1.64
                                                                        ? n <= 2e3
                                                                            ? (a = "pELS")
                                                                            : n > 2e3 && (a = "dELS")
                                                                        : (a =
                                                                              e.ctcf > 1.64
                                                                                  ? "CA-CTCF"
                                                                                  : "1" === e.tf
                                                                                    ? "CA-TF"
                                                                                    : "CA")
                                                                  : (a = "1" === e.tf ? "TF" : "InActive")
                                                              : (a = "noclass"),
                                                          a
                                                      );
                                                  })(S, M, F);
                                              return {
                                                  name: e.name,
                                                  ontology: e.ontology,
                                                  sampleType: e.sampleType,
                                                  displayname: e.displayname,
                                                  lifeStage: e.lifeStage,
                                                  class: v,
                                                  collection:
                                                      -11 === h
                                                          ? "ancillary"
                                                          : -11 !== b && -11 !== C && -11 !== x
                                                            ? "core"
                                                            : "partial",
                                                  ...S,
                                              };
                                          })
                                    : null,
                            [N, v, M, F]
                        ),
                        P = (0, r.useMemo)(() => (null == G ? void 0 : G.filter((e) => "core" === e.collection)), [G]),
                        D = (0, r.useMemo)(
                            () => (null == G ? void 0 : G.filter((e) => "partial" === e.collection)),
                            [G]
                        ),
                        H = (0, r.useMemo)(
                            () => (null == G ? void 0 : G.filter((e) => "ancillary" === e.collection)),
                            [G]
                        ),
                        B = (0, r.useMemo)(() => {
                            if ("tables" !== t) return null == G ? void 0 : G.filter((e) => -11 !== e[t]);
                        }, [G, t]),
                        z = void 0 === M || void 0 === F || !P || !D || !H,
                        L = !!(x || R || w || _),
                        W = C ? [{ ...C.cCREQuery[0], displayname: "Cell Type Agnostic" }] : void 0,
                        $ = { slotProps: { toolbar: { csvOptions: { escapeFormulas: !1 } } } },
                        q = (0, r.useMemo)(() => {
                            if (!D) return;
                            let e = 0,
                                n = 0;
                            return (
                                D.forEach((t) => {
                                    t.dnase >= 1.64 ? e++ : n++;
                                }),
                                { highDNase: e, lowDNase: n }
                            );
                        }, [D]);
                    return (0, a.jsxs)(a.Fragment, {
                        children: [
                            (0, a.jsxs)(s.A, {
                                variant: "scrollable",
                                scrollButtons: "auto",
                                allowScrollButtonsMobile: !0,
                                value: t,
                                onChange: (e, n) => {
                                    c(n);
                                },
                                sx: { "& .MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 } },
                                children: [
                                    (0, a.jsx)(i.A, { value: "tables", label: "Classification" }),
                                    (0, a.jsx)(i.A, { value: "dnase", label: "DNase" }),
                                    (0, a.jsx)(i.A, { value: "atac", label: "ATAC" }),
                                    (0, a.jsx)(i.A, { value: "h3k4me3", label: "H3K4me3" }),
                                    (0, a.jsx)(i.A, { value: "h3k27ac", label: "H3K27ac" }),
                                    (0, a.jsx)(i.A, { value: "ctcf", label: "CTCF" }),
                                ],
                            }),
                            "tables" === t
                                ? (0, a.jsxs)(o.default, {
                                      spacing: 3,
                                      sx: { mt: "0rem", mb: "0rem" },
                                      children: [
                                          (0, a.jsx)(d.XIK, {
                                              label: "Cell type agnostic classification",
                                              rows: W,
                                              columns: U,
                                              loading: y,
                                              divHeight: W ? void 0 : { height: "182px" },
                                              error: !!b,
                                              ...$,
                                          }),
                                          (0, a.jsxs)("div", {
                                              children: [
                                                  (0, a.jsx)(E.nD, {
                                                      data: (0, E.jK)(P, "class", S.ds),
                                                      label: "Classification Proportions, Core Collection:",
                                                      loading: z || L,
                                                      getColor: (e) => {
                                                          var n;
                                                          return null != (n = u.N8.get(e).split(":")[1]) ? n : "black";
                                                      },
                                                      formatLabel: (e) => {
                                                          var n;
                                                          return null != (n = u.N8.get(e).split(":")[0]) ? n : e;
                                                      },
                                                      tooltipTitle: "Classification Proportions, Core Collection",
                                                      style: { marginBottom: "8px" },
                                                  }),
                                                  (0, a.jsx)(d.XIK, {
                                                      label: "Core Collection",
                                                      labelTooltip:
                                                          "Thanks to the extensive coordination efforts by the ENCODE4 Biosample Working Group, 171 biosamples have DNase, H3K4me3, H3K27ac, and CTCF data. We refer to these samples as the biosample-specific Core Collection of cCREs. These samples cover a variety of tissues and organs and primarily comprise primary tissues and cells. We suggest that users prioritize these samples for their analysis as they contain all the relevant marks for the most complete annotation of cCREs.",
                                                      rows: P,
                                                      columns: Y(),
                                                      loading: z,
                                                      error: L,
                                                      divHeight: { height: "400px" },
                                                      initialState: {
                                                          sorting: { sortModel: [{ field: "dnase", sort: "desc" }] },
                                                      },
                                                      ...$,
                                                  }),
                                              ],
                                          }),
                                          (0, a.jsxs)("div", {
                                              children: [
                                                  (0, a.jsx)(E.nD, {
                                                      data: q,
                                                      label: "Chromatin Accessibility, Partial Data Collection:",
                                                      loading: z || L,
                                                      getColor: (e) => ("highDNase" === e ? "#06DA93" : "#e1e1e1"),
                                                      formatLabel: (e) =>
                                                          "highDNase" === e
                                                              ? "High Chromatin Accessibility (DNase ≥ 1.64)"
                                                              : "Low Chromatin Accessibility (DNase < 1.64)",
                                                      tooltipTitle: "Chromatin Accessibility, Partial Data Collection",
                                                      style: { marginBottom: "12px" },
                                                  }),
                                                  (0, a.jsx)(d.XIK, {
                                                      label: "Partial Data Collection",
                                                      labelTooltip:
                                                          "To supplement the Core Collection, 1,154 biosamples have DNase in addition to various combinations of the other marks (but not all three). Though we are unable to annotate the full spectrum of cCRE classes in these biosamples, having DNase enables us to annotate element boundaries with high resolution. Therefore, we refer to this group as the Partial Data Collection. In these biosamples, we classify elements using the available marks. For example, if a sample lacks H3K27ac and CTCF, its cCREs can only be assigned to the promoter, CA-H3K4me3, and CA groups, not the enhancer or CA-CTCF groups. The Partial Data Collection contains some unique tissues and cell states that are not represented in the Core Collection, such as fetal brain tissue and stimulated immune cells that may be of high interest to some researchers. Therefore, if users are interested in cCRE annotations in such biosamples, we suggest leveraging the cell type-agnostic annotations or annotations from similar biosamples in the Core Collection, to supplement their analyses.",
                                                      rows: D,
                                                      columns: Y(),
                                                      loading: z,
                                                      error: L,
                                                      divHeight: { height: "400px" },
                                                      initialState: {
                                                          sorting: { sortModel: [{ field: "dnase", sort: "desc" }] },
                                                      },
                                                      ...$,
                                                  }),
                                              ],
                                          }),
                                          (0, a.jsx)(d.XIK, {
                                              label: "Ancillary Collection",
                                              labelTooltip:
                                                  "For the 563 biosamples lacking DNase data, we do not have the resolution to identify specific elements and we refer to these annotations as the Ancillary Collection. In these biosamples, we simply label cCREs as having a high or low signal for every available assay. We highly suggest that users do not use annotations from the Ancillary Collection unless they are anchoring their analysis on cCREs from the Core Collection or Partial Data Collection.",
                                              rows: H,
                                              columns: Y().filter((e) => "dnase" !== e.field && "group" !== e.field),
                                              loading: z,
                                              error: L,
                                              divHeight: { height: "400px" },
                                              initialState: {
                                                  sorting: { sortModel: [{ field: "atac", sort: "desc" }] },
                                              },
                                              ...$,
                                          }),
                                      ],
                                  })
                                : (0, a.jsx)(Q, { rows: B, columns: Y(), assay: t, entity: n }),
                        ],
                    });
                };
        },
        77406: (e, n, t) => {
            t.d(n, { Bx: () => l, Td: () => r, ds: () => a });
            let a = ["PLS", "pELS", "dELS", "CA-H3K4me3", "CA-CTCF", "CA-TF", "CA", "TF", "InActive", "noclass"],
                r = {
                    PLS: "Promoter",
                    pELS: "Proximal Enhancer",
                    dELS: "Distal Enhancer",
                    "CA-H3K4me3": "CA-H3K4me3",
                    "CA-CTCF": "CA-CTCF",
                    "CA-TF": "CA-TF",
                    CA: "CA",
                    TF: "TF",
                },
                l = ["dnase", "atac", "h3k4me3", "h3k27ac", "ctcf"];
        },
        79194: (e, n, t) => {
            t.d(n, { A: () => c });
            var a = t(95155);
            t(12115);
            var r = t(50301),
                l = t(7291),
                s = t(49571),
                i = t(80357),
                o = t(34493);
            let c = (e) => {
                let { autoSort: n, setAutoSort: t } = e;
                return (0, a.jsx)(r.A, {
                    title: "Auto sort selected rows",
                    children: (0, a.jsx)(l.A, {
                        value: "autoSort",
                        control: (0, a.jsx)(s.A, {
                            color: "primary",
                            size: "small",
                            sx: { mr: 1 },
                            checked: n,
                            onChange: (e, n) => t(n),
                        }),
                        label: (0, a.jsx)(i.default, {
                            sx: { display: "flex", alignItems: "center", lineHeight: 1 },
                            children: (0, a.jsx)(o.A, { fontSize: "small" }),
                        }),
                        labelPlacement: "start",
                    }),
                });
            };
        },
        81362: (e, n, t) => {
            t.d(n, { J1: () => a.J });
            var a = t(78224);
        },
        81387: (e, n, t) => {
            t.d(n, { A: () => l });
            var a = t(40650),
                r = t(80207);
            let l = function (e, n) {
                    let {
                        loading: t,
                        error: r,
                        data: l,
                    } = (0, a.IT)(s, {
                        variables: { accessions: e, assembly: "grch38" },
                        skip: n || !e || (null == e ? void 0 : e.length) === 0,
                    });
                    return { data: null == l ? void 0 : l.linkedGenes, loading: t, error: r };
                },
                s = (0, r.J1)(
                    "\n  query linkedGenes(\n    $assembly: String!  \n    $accessions: [String!]!    \n\n  ) {\n    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {\n      accession  \n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      tissue\n      displayname\n    }\n  }\n"
                );
        },
        81745: (e, n, t) => {
            t.d(n, { A: () => R });
            var a = t(95155),
                r = t(78120),
                l = t(77524),
                s = t(80317),
                i = t(24251),
                o = t(40670),
                c = t(64647),
                d = t(80357),
                u = t(24288),
                h = t(99496),
                m = t(97179),
                p = t(2021),
                g = t(75265),
                x = t(39620),
                f = t(86596),
                C = t(6170),
                y = t(12115);
            let b = [
                "chr1",
                "chr2",
                "chr3",
                "chr4",
                "chr5",
                "chr6",
                "chr7",
                "chr8",
                "chr9",
                "chr10",
                "chr11",
                "chr12",
                "chr13",
                "chr14",
                "chr15",
                "chr16",
                "chr17",
                "chr18",
                "chr19",
                "chr20",
                "chr21",
                "chr22",
                "chrX",
                "chrY",
            ];
            function S(e) {
                let { browserStore: n } = e,
                    t = n((e) => e.addHighlight),
                    d = n((e) => e.domain),
                    [u, h] = (0, y.useState)({ id: "", chromosome: "", start: "", end: "", color: "#0000FF" }),
                    [p, g] = (0, y.useState)({ chromosome: "", start: "", end: "" }),
                    C = (e, n) => {
                        if (!e) return "".concat(n.charAt(0).toUpperCase() + n.slice(1), " position is required");
                        let t = parseInt(e);
                        return isNaN(t)
                            ? "".concat(n.charAt(0).toUpperCase() + n.slice(1), " must be a number")
                            : t < 0
                              ? "".concat(n.charAt(0).toUpperCase() + n.slice(1), " must be positive")
                              : "";
                    },
                    S = (e, n) => {
                        h((t) => ({ ...t, [e]: n })), p[e] && g((n) => ({ ...n, [e]: "" }));
                    };
                return (0, a.jsxs)(r.A, {
                    sx: { mb: 2 },
                    children: [
                        (0, a.jsx)(l.A, {
                            expandIcon: (0, a.jsx)(x.A, {}),
                            "aria-controls": "highlight-form-content",
                            id: "highlight-form-header",
                            sx: { backgroundColor: "#f5f5f5", "&:hover": { backgroundColor: "lightgray" } },
                            children: (0, a.jsxs)(s.default, {
                                variant: "h6",
                                sx: { display: "flex", alignItems: "center" },
                                children: [(0, a.jsx)(f.A, { sx: { mr: 1 } }), "Add New Highlight"],
                            }),
                        }),
                        (0, a.jsx)(i.A, {
                            children: (0, a.jsxs)(m.A, {
                                container: !0,
                                spacing: 2,
                                children: [
                                    (0, a.jsx)(m.A, {
                                        size: { xs: 12, sm: 4 },
                                        children: (0, a.jsx)(o.A, {
                                            fullWidth: !0,
                                            label: "Chromosome",
                                            value: u.chromosome,
                                            onChange: (e) => S("chromosome", e.target.value),
                                            size: "small",
                                            placeholder: "e.g., chr1",
                                            error: !!p.chromosome,
                                            helperText: p.chromosome,
                                        }),
                                    }),
                                    (0, a.jsx)(m.A, {
                                        size: { xs: 12, sm: 4 },
                                        children: (0, a.jsx)(o.A, {
                                            fullWidth: !0,
                                            label: "Start Position",
                                            value: u.start,
                                            onChange: (e) => S("start", e.target.value),
                                            size: "small",
                                            placeholder: "e.g., 1000000",
                                            type: "number",
                                            error: !!p.start,
                                            helperText: p.start,
                                        }),
                                    }),
                                    (0, a.jsx)(m.A, {
                                        size: { xs: 12, sm: 4 },
                                        children: (0, a.jsx)(o.A, {
                                            fullWidth: !0,
                                            label: "End Position",
                                            value: u.end,
                                            onChange: (e) => S("end", e.target.value),
                                            size: "small",
                                            placeholder: "e.g., 2000000",
                                            type: "number",
                                            error: !!p.end,
                                            helperText: p.end,
                                        }),
                                    }),
                                    (0, a.jsx)(m.A, {
                                        size: { xs: 12, sm: 6 },
                                        children: (0, a.jsx)(o.A, {
                                            fullWidth: !0,
                                            label: "Color",
                                            value: u.color,
                                            onChange: (e) => S("color", e.target.value),
                                            size: "small",
                                            type: "color",
                                            sx: { "& input[type='color']": { height: "23px", cursor: "pointer" } },
                                        }),
                                    }),
                                    (0, a.jsx)(m.A, {
                                        size: { xs: 12, sm: 6 },
                                        children: (0, a.jsx)(o.A, {
                                            fullWidth: !0,
                                            label: "ID",
                                            value: u.id,
                                            onChange: (e) => S("id", e.target.value),
                                            size: "small",
                                            placeholder: "Enter highlight ID",
                                        }),
                                    }),
                                    (0, a.jsx)(m.A, {
                                        size: { xs: 12, sm: 6 },
                                        children: (0, a.jsx)(c.default, {
                                            variant: "contained",
                                            fullWidth: !0,
                                            onClick: () => {
                                                S("chromosome", d.chromosome),
                                                    S("start", d.start.toString()),
                                                    S("end", d.end.toString());
                                            },
                                            children: "Use Current Region",
                                        }),
                                    }),
                                    (0, a.jsx)(m.A, {
                                        size: { xs: 12, sm: 6 },
                                        children: (0, a.jsx)(c.default, {
                                            fullWidth: !0,
                                            variant: "contained",
                                            startIcon: (0, a.jsx)(f.A, {}),
                                            onClick: () => {
                                                var e;
                                                let n = (e = u.chromosome)
                                                        ? b.includes(e)
                                                            ? ""
                                                            : "Invalid chromosome. Use format: chr1, chr2, ..., chr22, chrX, chrY"
                                                        : "Chromosome is required",
                                                    a = C(u.start, "start"),
                                                    r = C(u.end, "end"),
                                                    l = r;
                                                a ||
                                                    r ||
                                                    (parseInt(u.start) >= parseInt(u.end) &&
                                                        (l = "End position must be greater than start position")),
                                                    g({ chromosome: n, start: a, end: l }),
                                                    n ||
                                                        a ||
                                                        l ||
                                                        (t({
                                                            id: u.id,
                                                            domain: {
                                                                chromosome: u.chromosome,
                                                                start: parseInt(u.start),
                                                                end: parseInt(u.end),
                                                            },
                                                            color: u.color,
                                                        }),
                                                        h({
                                                            id: "",
                                                            chromosome: "",
                                                            start: "",
                                                            end: "",
                                                            color: "#0000FF",
                                                        }),
                                                        g({ chromosome: "", start: "", end: "" }));
                                            },
                                            disabled: !u.id || !u.chromosome || !u.start || !u.end,
                                            children: "Add Highlight",
                                        }),
                                    }),
                                ],
                            }),
                        }),
                    ],
                });
            }
            function v(e) {
                let { highlight: n, index: t, browserStore: r } = e,
                    l = r((e) => e.removeHighlight);
                return (0, a.jsxs)(d.default, {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left",
                    width: "100%",
                    bgcolor: t % 2 == 0 ? "#f5f5f5" : "white",
                    sx: { "&:hover": { backgroundColor: "lightgray" } },
                    p: 2,
                    mb: 1,
                    children: [
                        (0, a.jsxs)(d.default, {
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            children: [
                                (0, a.jsx)(s.default, { variant: "body1", color: n.color, children: n.id }),
                                (0, a.jsx)(u.A, {
                                    size: "small",
                                    onClick: () => {
                                        l(n.id);
                                    },
                                    sx: {
                                        color: "gray",
                                        "&:hover": { color: "red", backgroundColor: "rgba(255, 0, 0, 0.1)" },
                                    },
                                    children: (0, a.jsx)(C.A, { fontSize: "small" }),
                                }),
                            ],
                        }),
                        (0, a.jsx)(d.default, {
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            children: (0, a.jsxs)(s.default, {
                                variant: "body2",
                                color: "gray",
                                children: [
                                    n.domain.chromosome,
                                    ":",
                                    n.domain.start.toLocaleString(),
                                    "-",
                                    n.domain.end.toLocaleString(),
                                ],
                            }),
                        }),
                    ],
                });
            }
            function j(e) {
                let { browserStore: n } = e,
                    t = n((e) => e.highlights);
                return (0, a.jsx)(a.Fragment, {
                    children: t.map((e, t) =>
                        (0, a.jsx)(v, { highlight: { ...e, domain: e.domain }, index: t, browserStore: n }, e.id)
                    ),
                });
            }
            function R(e) {
                let { open: n, setOpen: t, browserStore: r } = e;
                return (0, a.jsxs)(g.A, {
                    open: n,
                    onClose: () => t(!1),
                    maxWidth: "sm",
                    fullWidth: !0,
                    children: [
                        (0, a.jsx)(p.A, { children: "Current Highlights" }),
                        (0, a.jsxs)(h.A, {
                            children: [(0, a.jsx)(S, { browserStore: r }), (0, a.jsx)(j, { browserStore: r })],
                        }),
                    ],
                });
            }
        },
        82293: (e, n, t) => {
            t.d(n, { H: () => i });
            var a = t(40650),
                r = t(78224);
            let l = (0, r.J)(
                    "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n    \n  }\n}"
                ),
                s = (0, r.J)(
                    "\n  query cCRESCREENSearchQuery(\n    $accessions: [String!]\n    $assembly: String!\n    $cellType: String\n    $coordinates: [GenomicRangeInput]\n    $nearbygeneslimit: Int\n  ) {\n    cCRESCREENSearch(\n      assembly: $assembly\n      accessions: $accessions\n      coordinates: $coordinates\n      cellType: $cellType\n      nearbygeneslimit: $nearbygeneslimit\n    ) {\n      chrom\n      start\n      len\n      pct\n      info {\n        accession\n      }\n      ctcf_zscore\n      dnase_zscore\n      enhancer_zscore\n      promoter_zscore\n      atac_zscore\n      nearestgenes {\n        gene        \n        distance\n      }\n      ctspecific {\n        ct\n        dnase_zscore\n        h3k4me3_zscore\n        h3k27ac_zscore\n        ctcf_zscore\n        atac_zscore\n      }  \n    }\n  }\n"
                ),
                i = (e) => {
                    let {
                            accession: n,
                            coordinates: t,
                            entityType: r,
                            assembly: i,
                            nearbygeneslimit: o,
                            cellType: c,
                            skip: d,
                        } = e,
                        {
                            data: u,
                            loading: h,
                            error: m,
                        } = (0, a.IT)(s, {
                            variables: {
                                coordinates: t ? (Array.isArray(t) ? t : [t]) : t,
                                accessions: n ? (Array.isArray(n) ? n : [n]) : void 0,
                                assembly: i,
                                nearbygeneslimit: o || 3,
                                cellType: c,
                            },
                            skip:
                                d ||
                                (void 0 !== r && "ccre" !== r) ||
                                ((!n || (Array.isArray(n) && 0 === n.length)) &&
                                    (!t || (Array.isArray(t) && 0 === t.length))),
                        }),
                        {
                            data: p,
                            loading: g,
                            error: x,
                        } = (0, a.IT)(l, {
                            variables: {
                                assembly: "grch38",
                                includeiCREs: !0,
                                accession: null == u ? void 0 : u.cCRESCREENSearch.map((e) => e.info.accession),
                            },
                            skip: h || !u || (u && 0 === u.cCRESCREENSearch.length) || "GRCh38" !== i,
                        }),
                        f = {};
                    return (
                        p &&
                            p.cCREAutocompleteQuery.length > 0 &&
                            p.cCREAutocompleteQuery.forEach((e) => {
                                f[e.accession] = e.isiCRE;
                            }),
                        {
                            data:
                                t || "object" == typeof n
                                    ? null == u
                                        ? void 0
                                        : u.cCRESCREENSearch.map((e) => ({ ...e, isicre: f && f[e.info.accession] }))
                                    : (null == u ? void 0 : u.cCRESCREENSearch[0])
                                      ? {
                                            ...u.cCRESCREENSearch[0],
                                            isicre: f && f[u.cCRESCREENSearch[0].info.accession],
                                        }
                                      : void 0,
                            loading: h,
                            error: m,
                        }
                    );
                };
        },
        84185: (e, n, t) => {
            t.d(n, { B: () => r });
            var a = t(12115);
            function r(e) {
                let n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "variant",
                    [t, r] = (0, a.useState)(void 0),
                    [l, s] = (0, a.useState)(!1),
                    [i, o] = (0, a.useState)(null);
                return (
                    (0, a.useEffect)(() => {
                        if ((void 0 !== n && "variant" !== n) || t || l || !e || 0 === e.length) return;
                        let a = [...new Set(e)];
                        0 !== a.length &&
                            (s(!0),
                            o(null),
                            (async () => {
                                try {
                                    let e = { ...t };
                                    await Promise.all(
                                        a.map(async (n) => {
                                            try {
                                                let t = await fetch(
                                                    "https://rest.ensembl.org/variation/homo_sapiens/".concat(
                                                        n,
                                                        "?content-type=application/json;pops=1"
                                                    )
                                                );
                                                if (!t.ok) throw Error("HTTP error ".concat(t.status));
                                                let a = await t.json(),
                                                    r = a.mappings[0].allele_string.split("/"),
                                                    l = r[0],
                                                    s = r.slice(1).join(","),
                                                    i = [
                                                        "1000GENOMES:phase_3:AMR",
                                                        "1000GENOMES:phase_3:EUR",
                                                        "1000GENOMES:phase_3:AFR",
                                                        "1000GENOMES:phase_3:SAS",
                                                        "1000GENOMES:phase_3:EAS",
                                                    ],
                                                    o = a.populations
                                                        .filter((e) => i.includes(e.population) && e.allele === l)
                                                        .map((e) => ({
                                                            population: e.population.replace(
                                                                "1000GENOMES:phase_3:",
                                                                ""
                                                            ),
                                                            frequency: e.frequency,
                                                        }));
                                                e[n] = { ref: l, alt: s, frequencies: o };
                                            } catch (t) {
                                                e[n] = null;
                                            }
                                        })
                                    ),
                                        r(e);
                                } catch (e) {
                                    o(e.message || "Unknown error"), r({});
                                } finally {
                                    s(!1);
                                }
                            })());
                    }, [e]),
                    { data: t, loading: l, error: i }
                );
            }
        },
        86265: (e, n, t) => {
            t.d(n, { default: () => K });
            var a = t(95155),
                r = t(98568),
                l = t(12115),
                s = t(12981),
                i = t(96869),
                o = t(80357),
                c = t(24288),
                d = t(64647),
                u = t(25789),
                h = t(80494),
                m = t(83982),
                p = t(87189),
                g = t(81745),
                x = t(88632),
                f = t(20063),
                C = t(27919),
                y = t(48295),
                b = t(91665),
                S = t(77255),
                v = t(29999),
                j = t(86596),
                R = t(75265),
                E = t(2021),
                N = t(99496),
                A = t(80317),
                w = t(41189),
                T = t(1684);
            let k = (e) => {
                let { open: n, setOpen: t, selectedChromHmmTissues: r, setSelectedChromHmmTissues: l } = e,
                    s = w.K1.filter((e) => !r.includes(e));
                return (0, a.jsxs)(R.A, {
                    open: n,
                    onClose: () => t(!1),
                    disableRestoreFocus: !0,
                    children: [
                        (0, a.jsx)(E.A, { children: "Select ChromHMM Bulk Bed Tracks" }),
                        (0, a.jsxs)(N.A, {
                            children: [
                                (0, a.jsxs)("div", {
                                    children: [
                                        (0, a.jsx)(A.default, { mt: 2, children: "Selected:" }),
                                        r.length
                                            ? null == r
                                                ? void 0
                                                : r.map((e, n) =>
                                                      (0, a.jsxs)(
                                                          i.default,
                                                          {
                                                              mt: 1,
                                                              direction: "row",
                                                              alignItems: "center",
                                                              children: [
                                                                  (0, a.jsx)(c.A, {
                                                                      onClick: () => l(r.filter((n) => n !== e)),
                                                                      children: (0, a.jsx)(v.A, {}),
                                                                  }),
                                                                  (0, a.jsx)(A.default, { children: (0, T.Zr)(e) }),
                                                              ],
                                                          },
                                                          n
                                                      )
                                                  )
                                            : (0, a.jsx)(A.default, { children: "None" }),
                                    ],
                                }),
                                (0, a.jsxs)("div", {
                                    children: [
                                        (0, a.jsx)(A.default, { mt: 2, children: "Available:" }),
                                        null == s
                                            ? void 0
                                            : s.map((e, n) =>
                                                  (0, a.jsxs)(
                                                      i.default,
                                                      {
                                                          mt: 1,
                                                          direction: "row",
                                                          alignItems: "center",
                                                          children: [
                                                              (0, a.jsx)(c.A, {
                                                                  onClick: () => l((n) => [...n, e]),
                                                                  children: (0, a.jsx)(j.A, {}),
                                                              }),
                                                              (0, a.jsx)(A.default, { children: (0, T.Zr)(e) }),
                                                          ],
                                                      },
                                                      n
                                                  )
                                              ),
                                    ],
                                }),
                            ],
                        }),
                    ],
                });
            };
            var _ = t(60640);
            function I(e) {
                let {
                        browserStore: n,
                        assembly: t,
                        onBiosampleSelected: r,
                        selectedBiosamples: s,
                        selectedChromHmmTissues: i,
                        setSelectedChromHmmTissues: c,
                    } = e,
                    [u, h] = (0, l.useState)(!1),
                    [m, p] = (0, l.useState)(!1),
                    [x, f] = (0, l.useState)(!1);
                return (0, a.jsxs)(o.default, {
                    display: "flex",
                    gap: 1,
                    children: [
                        (0, a.jsx)(d.default, {
                            variant: "contained",
                            startIcon: (0, a.jsx)(S.A, {}),
                            size: "small",
                            onClick: () => h(!0),
                            children: "Highlights",
                        }),
                        (0, a.jsx)(d.default, {
                            variant: "contained",
                            startIcon: (0, a.jsx)(b.A, {}),
                            size: "small",
                            onClick: () => void p(!m),
                            children: "Biosample Tracks",
                        }),
                        "GRCh38" === t &&
                            (0, a.jsx)(d.default, {
                                variant: "contained",
                                startIcon: (0, a.jsx)(b.A, {}),
                                size: "small",
                                onClick: () => f(!0),
                                children: "ChromHMM Tracks",
                            }),
                        (0, a.jsx)(g.A, { open: u, setOpen: h, browserStore: n }),
                        (0, a.jsx)(k, {
                            open: x,
                            setOpen: f,
                            selectedChromHmmTissues: i,
                            setSelectedChromHmmTissues: c,
                        }),
                        (0, a.jsx)(_.A, {
                            assembly: t,
                            open: m,
                            setOpen: p,
                            onChange: (e) => {
                                r(e);
                            },
                            multiSelect: !0,
                            initialSelected: s || [],
                        }),
                    ],
                });
            }
            var M = t(10152),
                F = t(40650),
                G = t(81362),
                P = t(94434);
            let D = (0, G.J1)(
                "\n  query fetchRNASeqData($assembly: String!, $biosample: [String]) {\n    rnaSeqQuery(assembly: $assembly, biosample: $biosample) {\n      expid\n      biosample\n      posfileid\n      negfileid\n      unstrandedfileid\n    }\n  }\n"
            );
            function H(e) {
                if (!window.sessionStorage) return null;
                let n = sessionStorage.getItem(e + "-browser-state");
                return n ? JSON.parse(n) : null;
            }
            var B = t(9063);
            let z = { Coordinate: "region", Gene: "gene", SNP: "variant", Study: "gwas", cCRE: "ccre", iCRE: "ccre" },
                L = { ccre: 20, gene: 0.2, variant: 5, region: 0.25, gwas: 0.2 };
            function W(e, n) {
                let t = e.end - e.start;
                t <= 100 && (t = 100);
                let a = Math.floor(t * L[n]);
                return { chromosome: e.chromosome, start: Math.max(0, e.start - a), end: e.end + a };
            }
            function $(e) {
                let { entity: n, coordinates: t } = e,
                    r = n.entityID,
                    [b, S] = (0, l.useState)(
                        (function () {
                            if (!window.sessionStorage) return null;
                            let e = sessionStorage.getItem("selected-biosamples");
                            return e ? JSON.parse(e) : null;
                        })()
                    ),
                    [v, j] = (0, l.useState)(
                        (function () {
                            if (!window.sessionStorage) return null;
                            let e = sessionStorage.getItem("selected-chromhmm-tissues");
                            return e ? JSON.parse(e) : [];
                        })()
                    ),
                    R = (0, l.useMemo)(() => {
                        var e, a, l;
                        return {
                            domain: null != (l = null == (e = H(r)) ? void 0 : e.domain) ? l : W(t, n.entityType),
                            marginWidth: 150,
                            trackWidth: 1350,
                            multiplier: 3,
                            highlights: (null == (a = H(r)) ? void 0 : a.highlights) || [
                                {
                                    id: r || t.chromosome + ":" + t.start + "-" + t.end,
                                    domain: { chromosome: t.chromosome, start: t.start, end: t.end },
                                    color: (0, x.XL)(),
                                },
                            ],
                        };
                    }, [r, t, n.entityType]),
                    E = (0, h.WT)(R, [R]),
                    N = E((e) => e.addHighlight),
                    A = E((e) => e.removeHighlight),
                    k = E((e) => e.setDomain),
                    _ = E((e) => e.domain),
                    G = E((e) => e.highlights);
                (0, l.useEffect)(() => {
                    sessionStorage.setItem(r + "-browser-state", JSON.stringify({ domain: _, highlights: G }));
                }, [_, G, r]),
                    (0, l.useEffect)(() => {
                        null === b || 0 === b.length
                            ? sessionStorage.removeItem("selected-biosamples")
                            : sessionStorage.setItem("selected-biosamples", JSON.stringify(b));
                    }, [b]),
                    (0, l.useEffect)(() => {
                        null === v || 0 === v.length
                            ? sessionStorage.removeItem("selected-chromhmm-tissues")
                            : sessionStorage.setItem("selected-chromhmm-tissues", JSON.stringify(v));
                    }, [v]);
                let L = (0, f.useRouter)(),
                    $ = (0, l.useCallback)(
                        (e) => {
                            let t = e.name;
                            L.push("/".concat(n.assembly, "/ccre/").concat(t));
                        },
                        [n.assembly, L]
                    ),
                    q = (0, l.useCallback)(
                        (e) => {
                            let t = e.name;
                            t.includes("ENSG") || L.push("/".concat(n.assembly, "/gene/").concat(t));
                        },
                        [n.assembly, L]
                    ),
                    O = (0, l.useMemo)(() => {
                        let e = (function () {
                            let e = sessionStorage.getItem("local-tracks");
                            return e ? JSON.parse(e) : [];
                        })();
                        if (e.length > 0)
                            return (
                                e.forEach((e) => {
                                    e.trackType === h.S.Transcript &&
                                        ((e.geneName = r),
                                        (e.onHover = (e) => {
                                            N({
                                                id: e.name + "-temp",
                                                domain: { start: e.coordinates.start, end: e.coordinates.end },
                                                color: e.color || "blue",
                                            });
                                        }),
                                        (e.onLeave = (e) => {
                                            A(e.name + "-temp");
                                        }),
                                        (e.onClick = (e) => {
                                            q(e);
                                        })),
                                        e.trackType === h.S.BigBed &&
                                            ((e.onHover = (e) => {
                                                N({
                                                    id: e.name + "-temp",
                                                    domain: { start: e.start, end: e.end },
                                                    color: e.color || "blue",
                                                });
                                            }),
                                            (e.onLeave = (e) => {
                                                A(e.name + "-temp");
                                            }),
                                            (e.onClick = (e) => {
                                                $(e);
                                            }),
                                            (e.tooltip = (e) =>
                                                (0, a.jsx)(C.A, { assembly: n.assembly, name: e.name || "", ...e })));
                                }),
                                e
                            );
                        let t = "GRCh38" === n.assembly ? M.XY : M.Fc;
                        return [
                            {
                                id: "gene-track",
                                title: "GENCODE genes",
                                titleSize: 12,
                                height: 50,
                                color: "#AAAAAA",
                                trackType: h.S.Transcript,
                                assembly: n.assembly,
                                version: "GRCh38" === n.assembly ? 40 : 25,
                                displayMode: h.q5.Squish,
                                geneName: "gene" === n.entityType ? r : "",
                                onHover: (e) => {
                                    N({
                                        id: e.name + "-temp",
                                        domain: { start: e.coordinates.start, end: e.coordinates.end },
                                        color: e.color || "blue",
                                    });
                                },
                                onLeave: (e) => {
                                    A(e.name + "-temp");
                                },
                                onClick: (e) => {
                                    q(e);
                                },
                            },
                            {
                                id: "ccre-track",
                                title: "All cCREs colored by group",
                                titleSize: 12,
                                height: 20,
                                color: "#D05F45",
                                trackType: h.S.BigBed,
                                displayMode: h.q5.Dense,
                                url: "https://downloads.wenglab.org/".concat(n.assembly, "-cCREs.DCC.bigBed"),
                                onHover: (e) => {
                                    N({
                                        id: e.name + "-temp",
                                        domain: { start: e.start, end: e.end },
                                        color: e.color || "blue",
                                    });
                                },
                                onLeave: (e) => {
                                    A(e.name + "-temp");
                                },
                                onClick: (e) => {
                                    $(e);
                                },
                                tooltip: (e) => (0, a.jsx)(C.A, { assembly: n.assembly, name: e.name || "", ...e }),
                            },
                            ...t,
                        ];
                    }, [n.assembly, n.entityType, r, N, A, q, $]),
                    K = (0, h.FV)(O, [O]),
                    Q = K((e) => e.tracks),
                    Z = K((e) => e.editTrack);
                ((e, n, t, a, r, s) => {
                    let i = t((e) => e.insertTrack),
                        o = t((e) => e.tracks),
                        c = t((e) => e.removeTrack),
                        d = (0, l.useMemo)(() => (n && n.some((e) => e.rnaseq) ? n.map((e) => e.name) : null), [n]),
                        {
                            data: u,
                            loading: m,
                            error: p,
                        } = (0, F.IT)(D, { variables: { assembly: e.toLowerCase(), biosample: d }, skip: !d }),
                        g = (0, l.useMemo)(() => {
                            if (!n || m) return [];
                            let e = [];
                            for (let t of n) {
                                let n = [t.dnase_signal, t.h3k4me3_signal, t.h3k27ac_signal, t.ctcf_signal].filter(
                                    (e) => !!e
                                );
                                if (n.length > 0) {
                                    let l = "https://downloads.wenglab.org/Registry-V4/".concat(n.join("_"), ".bigBed"),
                                        i = {
                                            id: "biosample-ccre-".concat(t.name),
                                            title: "cCREs in ".concat(t.displayname),
                                            titleSize: 12,
                                            trackType: h.S.BigBed,
                                            displayMode: h.q5.Dense,
                                            color: M.an,
                                            height: 20,
                                            url: l,
                                            onHover: a,
                                            onLeave: r,
                                            onClick: s,
                                        };
                                    e.push(i);
                                }
                                t.dnase_signal &&
                                    e.push({
                                        id: "biosample-dnase-".concat(t.name),
                                        title: "DNase-seq signal in ".concat(t.displayname),
                                        titleSize: 12,
                                        trackType: h.S.BigWig,
                                        displayMode: h.q5.Full,
                                        color: P.R0.dnase,
                                        height: 50,
                                        url: "https://www.encodeproject.org/files/"
                                            .concat(t.dnase_signal, "/@@download/")
                                            .concat(t.dnase_signal, ".bigWig"),
                                    }),
                                    t.h3k4me3_signal &&
                                        e.push({
                                            id: "biosample-h3k4me3-".concat(t.name),
                                            title: "H3K4me3 ChIP-seq signal in ".concat(t.displayname),
                                            titleSize: 12,
                                            trackType: h.S.BigWig,
                                            displayMode: h.q5.Full,
                                            color: P.R0.h3k4me3,
                                            height: 50,
                                            url: "https://www.encodeproject.org/files/"
                                                .concat(t.h3k4me3_signal, "/@@download/")
                                                .concat(t.h3k4me3_signal, ".bigWig"),
                                        }),
                                    t.h3k27ac_signal &&
                                        e.push({
                                            id: "biosample-h3k27ac-".concat(t.name),
                                            title: "H3K27ac ChIP-seq signal in ".concat(t.displayname),
                                            titleSize: 12,
                                            trackType: h.S.BigWig,
                                            displayMode: h.q5.Full,
                                            color: P.R0.h3k27ac,
                                            height: 50,
                                            url: "https://www.encodeproject.org/files/"
                                                .concat(t.h3k27ac_signal, "/@@download/")
                                                .concat(t.h3k27ac_signal, ".bigWig"),
                                        }),
                                    t.ctcf_signal &&
                                        e.push({
                                            id: "biosample-ctcf-".concat(t.name),
                                            title: "CTCF ChIP-seq signal in ".concat(t.displayname),
                                            titleSize: 12,
                                            trackType: h.S.BigWig,
                                            displayMode: h.q5.Full,
                                            color: P.R0.ctcf,
                                            height: 50,
                                            url: "https://www.encodeproject.org/files/"
                                                .concat(t.ctcf_signal, "/@@download/")
                                                .concat(t.ctcf_signal, ".bigWig"),
                                        });
                            }
                            return e;
                        }, [n, m, a, r, s]),
                        x = (0, l.useMemo)(() => {
                            if (!d || m || p || !(null == u ? void 0 : u.rnaSeqQuery)) return [];
                            let e = [];
                            return (
                                u.rnaSeqQuery.forEach((t) => {
                                    let { expid: a, biosample: r, posfileid: l, negfileid: s, unstrandedfileid: i } = t,
                                        o = (e, t, a, l) => ({
                                            id: "rnaseq_".concat(e, "-").concat(t, "-").concat(a),
                                            title: "RNA-seq "
                                                .concat(a, " strand signal of unique reads rep 1 ")
                                                .concat(e, " ")
                                                .concat(t, " in ")
                                                .concat(n.find((e) => e.name === r).displayname),
                                            height: 50,
                                            titleSize: 12,
                                            trackType: h.S.BigWig,
                                            color: l,
                                            url: "https://www.encodeproject.org/files/"
                                                .concat(t, "/@@download/")
                                                .concat(t, ".bigWig?proxy=true"),
                                            displayMode: h.q5.Full,
                                        });
                                    l && e.push(o(a, l, "plus", "#00AA00")),
                                        s && e.push(o(a, s, "minus", "#00AA00")),
                                        i && e.push(o(a, i, "unstranded", "#00AA00"));
                                }),
                                e
                            );
                        }, [d, m, p, u, n]);
                    (0, l.useEffect)(() => {
                        [...g, ...x].forEach((e) => {
                            o.some((n) => n.id === e.id) || i(e);
                        }),
                            o.forEach((e) => {
                                e.id.includes("rnaseq_") && !x.some((n) => n.id === e.id) && c(e.id),
                                    e.id.includes("biosample-") && !g.some((n) => n.id === e.id) && c(e.id);
                            });
                    }, [x, g, i, c, o]);
                })(
                    n.assembly,
                    b,
                    K,
                    (e) => {
                        N({ color: e.color || "blue", domain: { start: e.start, end: e.end }, id: "tmp-ccre" });
                    },
                    () => {
                        A("tmp-ccre");
                    },
                    $
                ),
                    (function (e, n, t, r, s, i) {
                        let { tracks: o } = (0, w.Nr)(n, t),
                            c = (0, l.useRef)([]),
                            d = r((e) => e.insertTrack),
                            u = r((e) => e.removeTrack),
                            m = (0, l.useRef)(s),
                            p = (0, l.useRef)(i);
                        (0, l.useEffect)(() => {
                            (m.current = s), (p.current = i);
                        }, [s, i]),
                            (0, l.useEffect)(() => {
                                if (!o) return;
                                let n = c.current,
                                    t = e.filter((e) => !n.includes(e)),
                                    r = n.filter((n) => !e.includes(n));
                                t.forEach((e) => {
                                    let n = (function (e, n, t, r) {
                                        var l;
                                        let s = n[e];
                                        return {
                                            id: "ChromHmm_".concat(e, "_bulkbed"),
                                            titleSize: 12,
                                            color: null != (l = P.Me[e]) ? l : P.Me.missing,
                                            trackType: h.S.BulkBed,
                                            displayMode: h.q5.Full,
                                            datasets: s.map((e) => ({ name: e.displayName, url: e.url })),
                                            title: "".concat((0, T.Zr)(e), " ChromHMM States"),
                                            height: 15 * s.length,
                                            tooltip: (n) => {
                                                let t;
                                                return (
                                                    (t = n.name),
                                                    (0, a.jsxs)("g", {
                                                        children: [
                                                            (0, a.jsx)("rect", {
                                                                width: 240,
                                                                height: 92,
                                                                fill: "white",
                                                                stroke: "none",
                                                                filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))",
                                                            }),
                                                            (0, a.jsx)("rect", {
                                                                width: 15,
                                                                height: 15,
                                                                fill: M.PE[n.name].color,
                                                                x: 10,
                                                                y: 10,
                                                            }),
                                                            (0, a.jsxs)("text", {
                                                                x: 35,
                                                                y: 22,
                                                                fontSize: 12,
                                                                fontWeight: "bold",
                                                                children: [
                                                                    M.PE[n.name].description,
                                                                    "(",
                                                                    M.PE[n.name].stateno,
                                                                    ")",
                                                                ],
                                                            }),
                                                            (0, a.jsx)("text", {
                                                                x: 10,
                                                                y: 40,
                                                                fontSize: 12,
                                                                children: n.name,
                                                            }),
                                                            (0, a.jsx)("text", {
                                                                x: 10,
                                                                y: 58,
                                                                fontSize: 12,
                                                                children: e,
                                                            }),
                                                            (0, a.jsx)("text", {
                                                                x: 10,
                                                                y: 76,
                                                                fontSize: 12,
                                                                children: t,
                                                            }),
                                                        ],
                                                    })
                                                );
                                            },
                                            onHover: (e) => {
                                                t({
                                                    color: e.color,
                                                    domain: { start: e.start, end: e.end },
                                                    id: "tmp-bulkbed",
                                                });
                                            },
                                            onLeave: () => {
                                                r("tmp-bulkbed");
                                            },
                                        };
                                    })(e, o, m.current, p.current);
                                    console.log("inserting track", n.id), d(n);
                                }),
                                    r.forEach((e) => {
                                        let n = "ChromHmm_".concat(e, "_bulkbed");
                                        console.log("removing track", n), u(n);
                                    }),
                                    (c.current = e);
                            }, [e, o, d, u]);
                    })(v, t, n.assembly, K, N, A),
                    (0, l.useEffect)(() => {
                        sessionStorage.setItem("local-tracks", JSON.stringify(Q));
                    }, [Q]);
                let V = (0, u.default)(),
                    [J, U] = (0, l.useState)(!1),
                    X = "GRCh38" === n.assembly ? [29, 40] : 25;
                return (
                    (0, l.useEffect)(() => {
                        console.log(Q.map((e) => e.id));
                    }, [Q]),
                    (0, a.jsxs)(i.default, {
                        children: [
                            (0, a.jsxs)(i.default, {
                                direction: { xs: "column", md: "row" },
                                spacing: 2,
                                justifyContent: "space-between",
                                alignItems: "center",
                                children: [
                                    (0, a.jsxs)(o.default, {
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "center",
                                        children: [
                                            (0, a.jsx)(m.ALD, {
                                                size: "small",
                                                assembly: n.assembly,
                                                geneVersion: X,
                                                onSearchSubmit: (e) => {
                                                    "Gene" === e.type && Z("gene-track", { geneName: e.title }),
                                                        N({ domain: e.domain, color: (0, x.XL)(), id: e.title }),
                                                        k(W(e.domain, z[e.type]));
                                                },
                                                queries: ["Gene", "SNP", "cCRE", "Coordinate"],
                                                geneLimit: 3,
                                                sx: { minWidth: "200px", width: "350px", flexShrink: 1 },
                                                slots: {
                                                    button: (0, a.jsx)(c.A, {
                                                        sx: { color: V.palette.primary.main },
                                                        children: (0, a.jsx)(s.A, {}),
                                                    }),
                                                },
                                                slotProps: {
                                                    input: {
                                                        label: "Change Browser Region",
                                                        sx: {
                                                            backgroundColor: "white",
                                                            "& label.Mui-focused": { color: V.palette.primary.main },
                                                            "& .MuiOutlinedInput-root": {
                                                                "&.Mui-focused fieldset": {
                                                                    borderColor: V.palette.primary.main,
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            }),
                                            (0, a.jsxs)(d.default, {
                                                variant: "contained",
                                                startIcon: (0, a.jsx)(B.A, {}),
                                                color: "primary",
                                                size: "small",
                                                onClick: () => k(W(t, n.entityType)),
                                                children: ["Recenter on ", r || "Selected Region"],
                                            }),
                                        ],
                                    }),
                                    (0, a.jsx)(I, {
                                        browserStore: E,
                                        assembly: n.assembly,
                                        onBiosampleSelected: (e) => {
                                            e && 0 === e.length ? S(null) : S(e);
                                        },
                                        selectedBiosamples: b,
                                        selectedChromHmmTissues: v,
                                        setSelectedChromHmmTissues: j,
                                    }),
                                ],
                            }),
                            (0, a.jsxs)(i.default, {
                                direction: { xs: "column", lg: "row" },
                                spacing: 2,
                                justifyContent: "space-between",
                                alignItems: "center",
                                border: "1px solid rgb(204, 204, 204)",
                                borderBottom: "none",
                                p: 1,
                                mt: 2,
                                children: [
                                    (0, a.jsx)(y.A, { browserStore: E, assembly: n.assembly }),
                                    (0, a.jsx)(p.A, { browserStore: E }),
                                ],
                            }),
                            (0, a.jsx)(h.Pw, { browserStore: E, trackStore: K }),
                            (0, a.jsx)(g.A, { open: J, setOpen: U, browserStore: E }),
                        ],
                    })
                );
            }
            var q = t(98638),
                O = t(4615);
            function K(e) {
                let { entity: n } = e,
                    { data: t, loading: s, error: i } = (0, r.I)(n),
                    o = (0, l.useMemo)(
                        () =>
                            t && "GwasStudies" !== t.__typename
                                ? "SCREENSearchResult" === t.__typename
                                    ? { chromosome: t.chrom, start: t.start, end: t.start + t.len }
                                    : t.coordinates
                                : null,
                        [t]
                    );
                return s
                    ? (0, a.jsx)(q.A, {})
                    : i
                      ? (0, a.jsx)(O.A, {
                            severity: "error",
                            variant: "outlined",
                            children: "Error Fetching Genome Browser",
                        })
                      : (0, a.jsx)($, { entity: n, coordinates: o });
            }
        },
        87189: (e, n, t) => {
            t.d(n, { A: () => u });
            var a = t(95155),
                r = t(32968),
                l = t(64647),
                s = t(96869),
                i = t(80317),
                o = t(84389),
                c = t(80357),
                d = t(12115);
            function u(e) {
                let { browserStore: n } = e,
                    t = n((e) => e.domain),
                    u = n((e) => e.setDomain),
                    h = (0, d.useCallback)(
                        (e) => {
                            let n = Math.round((t.end - t.start) * e),
                                a = Math.round((t.start + t.end) / 2),
                                r = Math.max(0, Math.round(a - n / 2)),
                                l = Math.round(a + n / 2);
                            u({ ...t, start: r, end: l });
                        },
                        [t, u]
                    ),
                    m = (0, d.useCallback)(
                        (e) => {
                            let n = Math.round(e),
                                a = t.end - t.start,
                                r = Math.max(0, Math.round(t.start + n)),
                                l = Math.round(r + a);
                            u({ ...t, start: r, end: l });
                        },
                        [t, u]
                    ),
                    p = (e) => {
                        let { buttons: n } = e;
                        return (0, a.jsx)(r.A, {
                            children: n.map((e, n) =>
                                (0, a.jsx)(
                                    l.default,
                                    {
                                        variant: "outlined",
                                        size: "small",
                                        onClick: () => e.onClick(e.value),
                                        sx: { padding: "2px 8px", minWidth: "30px", fontSize: "0.8rem" },
                                        children: e.label,
                                    },
                                    n
                                )
                            ),
                        });
                    },
                    g = (e) => {
                        let { leftButtons: n, rightButtons: t, label: r } = e;
                        return (0, a.jsxs)(s.default, {
                            alignItems: "center",
                            children: [
                                (0, a.jsx)(i.default, { variant: "body2", children: r }),
                                (0, a.jsxs)(s.default, {
                                    direction: "row",
                                    spacing: 0.5,
                                    children: [
                                        (0, a.jsx)(p, { buttons: n }),
                                        (0, a.jsx)(o.A, { orientation: "vertical", flexItem: !0 }),
                                        (0, a.jsx)(p, { buttons: t }),
                                    ],
                                }),
                            ],
                        });
                    },
                    x = t.end - t.start,
                    f = {
                        moveLeft: [
                            { label: "◄◄◄", onClick: m, value: -x },
                            { label: "◄◄", onClick: m, value: -Math.round(x / 2) },
                            { label: "◄", onClick: m, value: -Math.round(x / 4) },
                        ],
                        moveRight: [
                            { label: "►", onClick: m, value: Math.round(x / 4) },
                            { label: "►►", onClick: m, value: Math.round(x / 2) },
                            { label: "►►►", onClick: m, value: x },
                        ],
                        zoomOut: [
                            { label: "-100x", onClick: h, value: 100 },
                            { label: "-10x", onClick: h, value: 10 },
                            { label: "-3x", onClick: h, value: 3 },
                            { label: "-1.5x", onClick: h, value: 1.5 },
                        ],
                        zoomIn: [
                            { label: "+1.5x", onClick: h, value: 1 / 1.5 },
                            { label: "+3x", onClick: h, value: 1 / 3 },
                            { label: "+10x", onClick: h, value: 0.1 },
                            { label: "+100x", onClick: h, value: 0.01 },
                        ],
                    };
                return (0, a.jsxs)(c.default, {
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: { xs: "wrap", lg: "nowrap" },
                    justifyContent: "center",
                    gap: 2,
                    children: [
                        (0, a.jsx)(g, { leftButtons: f.moveLeft, rightButtons: f.moveRight, label: "Move" }),
                        (0, a.jsx)(g, { leftButtons: f.zoomOut, rightButtons: f.zoomIn, label: "Zoom" }),
                    ],
                });
            }
        },
        88343: (e, n, t) => {
            t.d(n, { default: () => c });
            var a = t(95155),
                r = t(44945),
                l = t(51760),
                s = t(83982),
                i = t(98568),
                o = t(12115);
            let c = (e) => {
                let { entity: n } = e,
                    { data: t, loading: c, error: d } = (0, i.I)(n),
                    u = (0, o.useMemo)(
                        () =>
                            t && "GwasStudies" !== t.__typename
                                ? "SCREENSearchResult" === t.__typename
                                    ? { chromosome: t.chrom, start: t.start, end: t.start + t.len }
                                    : t.coordinates
                                : null,
                        [t]
                    ),
                    { data: h, loading: m, error: p } = (0, r.P)({ coordinates: u, assembly: "GRCh38", skip: !u }),
                    g = [
                        {
                            field: "id",
                            headerName: "rsID",
                            renderCell: (e) =>
                                (0, a.jsx)(l.g, { href: "/GRCh38/variant/".concat(e.value), children: e.value }),
                        },
                        {
                            field: "coordinates.chromosome",
                            headerName: "Chromosome",
                            valueGetter: (e, n) => n.coordinates.chromosome,
                        },
                        {
                            field: "coordinates.start",
                            headerName: "Start",
                            valueGetter: (e, n) => n.coordinates.start.toLocaleString(),
                        },
                        {
                            field: "coordinates.end",
                            headerName: "End",
                            valueGetter: (e, n) => n.coordinates.end.toLocaleString(),
                        },
                    ];
                return (0, a.jsx)(s.XIK, {
                    showToolbar: !0,
                    rows: h,
                    columns: g,
                    loading: c || m,
                    error: !!d || !!p,
                    label: "Intersecting SNPs",
                    emptyTableFallback: "No intersecting SNPs found in this region",
                    initialState: { sorting: { sortModel: [{ field: "coordinates.start", sort: "asc" }] } },
                    divHeight: { maxHeight: "400px" },
                });
            };
        },
        88632: (e, n, t) => {
            t.d(n, { XL: () => a });
            function a() {
                return "#" + Math.floor(0xffffff * Math.random()).toString(16);
            }
        },
        94457: (e, n, t) => {
            t.d(n, { theme: () => a });
            let a = (0, t(16650).A)({
                palette: {
                    mode: "light",
                    primary: { main: "#0c184a", light: "#100e98", contrastText: "#FFFFFF" },
                    secondary: { main: "#00063D", light: "#e4ebff" },
                },
                components: {
                    MuiAlert: {
                        styleOverrides: {
                            root: (e) => {
                                let { ownerState: n } = e;
                                return { ...("info" === n.severity && { backgroundColor: "#60a5fa" }) };
                            },
                        },
                    },
                    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
                    MuiTab: { styleOverrides: { root: { textTransform: "none" } } },
                },
            });
        },
        95395: (e, n, t) => {
            t.d(n, { FunctionalCharacterization: () => C });
            var a = t(95155);
            t(12115);
            var r = t(40650),
                l = t(83982),
                s = t(96869),
                i = t(78224),
                o = t(51760),
                c = t(82293);
            let d = (0, i.J)(
                    "\nquery functionalCharacterizationQuery($coordinates: [GenomicRangeInput!],$assembly: String!) {\n  functionalCharacterizationQuery(assembly: $assembly, coordinates: $coordinates) {\n    tissues\n    element_id\n    assay_result\n    chromosome\n    stop\n    start\n  }\n}\n"
                ),
                u = (0, i.J)(
                    "\nquery MPRA_FCC($coordinates: [GenomicRangeInput!]) {\n  mpraFccQuery(coordinates: $coordinates) {\n    celltype\n    chromosome\n    stop\n    start\n    assay_type\n    element_location\n    series\n    strand\n    log2fc\n    experiment    \n    barcode_location\n  }\n}\n"
                ),
                h = (0, i.J)(
                    "\n  query crisprFccQuery($accession: [String]!) {\n    crisprFccQuery(accession: $accession) {\n      rdhs\n      log2fc\n      fdr      \n      pvalue\n      experiment\n    }\n  }\n"
                ),
                m = (0, i.J)(
                    "\nquery capraFccSoloQuery($accession: [String]!) {\n  capraFccSoloQuery(accession: $accession) {\n    rdhs\n    log2fc\n    fdr\n    dna_rep1\n    rna_rep1\n    rna_rep2\n    rna_rep3\n    pvalue\n    experiment\n  }\n}\n"
                ),
                p = (0, i.J)(
                    "\nquery capraFccDoubleQuery($accession: [String]!) {\n  capraFccDoubleQuery(accession: $accession) {\n    rdhs_p1\n    rdhs_p2\n    log2fc\n    fdr\n    dna_rep1\n    rna_rep1\n    rna_rep2\n    rna_rep3\n    pvalue\n    experiment\n  }\n}\n"
                ),
                g = (0, i.J)(
                    "\nquery rdhs($rDHS: [String!],$assembly: String!) {\n  cCREQuery(assembly: $assembly, rDHS: $rDHS) {\n    accession\n  }\n}\n"
                ),
                x = {
                    ENCSR064KUD: { lab: "Kevin White, UChicago", cellType: "HCT116" },
                    ENCSR135NXN: { lab: "Kevin White, UChicago", cellType: "HepG2" },
                    ENCSR547SBZ: { lab: "Kevin White, UChicago", cellType: "MCF-7" },
                    ENCSR661FOW: { lab: "Tim Reddy, Duke", cellType: "K562" },
                    ENCSR858MPS: { lab: "Kevin White, UChicago", cellType: "K562" },
                    ENCSR895FDL: { lab: "Kevin White, UChicago", cellType: "A549" },
                    ENCSR983SZZ: { lab: "Kevin White, UChicago", cellType: "SH-SY5Y" },
                },
                f = {
                    ENCSR179FSH: {
                        design: "proliferation CRISPRi screen (dCas9-KRAB)",
                        lab: "Tim Reddy, Duke",
                        cellType: "OCI-AML2",
                    },
                    ENCSR274OEB: {
                        design: "proliferation CRISPRi screen (dCas9-KRAB)",
                        lab: "Tim Reddy, Duke",
                        cellType: "K562",
                    },
                    ENCSR295VER: {
                        design: "proliferation CRISPRi screen (dCas9-KRAB-WSR7EEE)",
                        lab: "Will Greenleaf, Stanford",
                        cellType: "K562",
                    },
                    ENCSR369UFO: {
                        design: "proliferation CRISPRi screen (dCas9-RYBP)",
                        lab: "Will Greenleaf, Stanford",
                        cellType: "K562",
                    },
                    ENCSR372CKT: {
                        design: "proliferation CRISPRi screen (dCas9-ZNF705-KRAB)",
                        lab: "Will Greenleaf, Stanford",
                        cellType: "K562",
                    },
                    ENCSR381RDB: {
                        design: "proliferation CRISPRi screen (dCas9-RYBP)",
                        lab: "Will Greenleaf, Stanford",
                        cellType: "K562",
                    },
                    ENCSR386FFV: {
                        design: "proliferation CRISPRi screen (dCas9-KRAB-WSR7EEE)",
                        lab: "Will Greenleaf, Stanford",
                        cellType: "K562",
                    },
                    ENCSR427OCU: {
                        design: "proliferation CRISPRi screen (dCas9-KRAB-MGA1-MGA2)",
                        lab: "Will Greenleaf, Stanford",
                        cellType: "K562",
                    },
                    ENCSR446RYW: {
                        design: "proliferation CRISPRi screen (dCas9-KRAB)",
                        lab: "Will Greenleaf, Stanford",
                        cellType: "K562",
                    },
                    ENCSR690DTG: {
                        design: "proliferation CRISPRi screen (dCas9-KRAB)",
                        lab: "Tim Reddy, Duke",
                        cellType: "K562",
                    },
                    ENCSR997ZOY: {
                        design: "proliferation CRISPRi screen (dCas)",
                        lab: "Will Greenleaf, Stanford",
                        cellType: "K562",
                    },
                },
                C = (e) => {
                    let { entity: n } = e,
                        { data: t, loading: i, error: C } = (0, c.H)({ assembly: n.assembly, accession: n.entityID }),
                        y = t && {
                            chromosome: null == t ? void 0 : t.chrom,
                            start: null == t ? void 0 : t.start,
                            end: (null == t ? void 0 : t.start) + (null == t ? void 0 : t.len),
                        },
                        b = "mm10" === n.assembly,
                        {
                            loading: S,
                            error: v,
                            data: j,
                        } = (0, r.IT)(d, {
                            variables: { assembly: n.assembly.toLowerCase(), coordinates: y },
                            skip: !y,
                            fetchPolicy: "cache-and-network",
                            nextFetchPolicy: "cache-first",
                        }),
                        {
                            loading: R,
                            error: E,
                            data: N,
                        } = (0, r.IT)(u, {
                            variables: { coordinates: y },
                            skip: b || !y,
                            fetchPolicy: "cache-and-network",
                            nextFetchPolicy: "cache-first",
                        }),
                        {
                            loading: A,
                            error: w,
                            data: T,
                        } = (0, r.IT)(h, {
                            variables: { accession: [n.entityID] },
                            skip: b,
                            fetchPolicy: "cache-and-network",
                            nextFetchPolicy: "cache-first",
                        }),
                        {
                            loading: k,
                            error: _,
                            data: I,
                        } = (0, r.IT)(m, {
                            variables: { accession: [n.entityID] },
                            skip: b,
                            fetchPolicy: "cache-and-network",
                            nextFetchPolicy: "cache-first",
                        }),
                        {
                            loading: M,
                            error: F,
                            data: G,
                        } = (0, r.IT)(p, {
                            variables: { accession: [n.entityID] },
                            skip: b,
                            fetchPolicy: "cache-and-network",
                            nextFetchPolicy: "cache-first",
                        }),
                        {
                            loading: P,
                            error: D,
                            data: H,
                        } = (0, r.IT)(g, {
                            variables: {
                                assembly: "GRCh38",
                                rDHS: [
                                    G && G.capraFccDoubleQuery.length > 0 && G.capraFccDoubleQuery[0].rdhs_p1,
                                    G && G.capraFccDoubleQuery.length > 0 && G.capraFccDoubleQuery[0].rdhs_p2,
                                ],
                            },
                            skip: void 0 === G || !G || (G && 0 === G.capraFccDoubleQuery.length),
                            fetchPolicy: "cache-and-network",
                            nextFetchPolicy: "cache-first",
                        });
                    return (0, a.jsxs)(s.default, {
                        spacing: 2,
                        children: [
                            (0, a.jsx)(l.XIK, {
                                label: "Mouse Transgenic Enhancer Assays",
                                columns: [
                                    { headerName: "Chromosome", field: "chromosome" },
                                    { headerName: "Start", field: "start", type: "number" },
                                    { headerName: "Stop", field: "stop", type: "number" },
                                    {
                                        headerName: "Element Id",
                                        field: "element_id",
                                        renderCell: (e) =>
                                            (0, a.jsx)(o.g, {
                                                href: "https://enhancer.lbl.gov/vista/element?vistaId=".concat(e.value),
                                                showExternalIcon: !0,
                                                openInNewTab: !0,
                                                children: e.value,
                                            }),
                                    },
                                    { headerName: "Assay Result", field: "assay_result" },
                                    {
                                        headerName: "Tissues [number of embryos positive/number of embryos negative]",
                                        field: "tissues",
                                    },
                                ],
                                rows: null == j ? void 0 : j.functionalCharacterizationQuery,
                                loading: S,
                                error: !!v,
                                initialState: { sorting: { sortModel: [{ field: "element_id", sort: "desc" }] } },
                            }),
                            "GRCh38" === n.assembly &&
                                (0, a.jsxs)(a.Fragment, {
                                    children: [
                                        (0, a.jsx)(l.XIK, {
                                            label: "MPRA (Region Centric)",
                                            columns: [
                                                { headerName: "Chromosome", field: "chromosome" },
                                                { headerName: "Start", field: "start", type: "number" },
                                                { headerName: "Stop", field: "stop", type: "number" },
                                                { headerName: "Strand", field: "strand" },
                                                {
                                                    headerName: "Log₂(Fold Change)",
                                                    field: "log2fc",
                                                    type: "number",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = e.value) ? void 0 : n.toFixed(2);
                                                    },
                                                },
                                                {
                                                    headerName: "Experiment",
                                                    field: "experiment",
                                                    renderCell: (e) =>
                                                        (0, a.jsx)(o.g, {
                                                            href: "https://www.encodeproject.org/experiments/".concat(
                                                                e.value
                                                            ),
                                                            showExternalIcon: !0,
                                                            openInNewTab: !0,
                                                            children: e.value,
                                                        }),
                                                },
                                                { headerName: "Cell Type", field: "celltype" },
                                                { headerName: "Assay Type", field: "assay_type" },
                                                { headerName: "Series", field: "series" },
                                                { headerName: "Location of element", field: "element_location" },
                                                { headerName: "Location of barcode", field: "barcode_location" },
                                            ],
                                            rows: null == N ? void 0 : N.mpraFccQuery,
                                            loading: R,
                                            error: !!E,
                                            initialState: {
                                                sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
                                            },
                                        }),
                                        (0, a.jsx)(l.XIK, {
                                            label: "STARR-seq (CAPRA quantification) Solo Fragments",
                                            columns: [
                                                {
                                                    headerName: "Experiment",
                                                    field: "a",
                                                    renderCell: (e) =>
                                                        (0, a.jsx)(o.g, {
                                                            href: "https://www.encodeproject.org/experiments/".concat(
                                                                e.row.experiment
                                                            ),
                                                            showExternalIcon: !0,
                                                            openInNewTab: !0,
                                                            children: e.row.experiment,
                                                        }),
                                                },
                                                {
                                                    headerName: "Celltype",
                                                    field: "b",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = x[e.row.experiment]) ? void 0 : n.cellType;
                                                    },
                                                },
                                                {
                                                    headerName: "Lab",
                                                    field: "c",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = x[e.row.experiment]) ? void 0 : n.lab;
                                                    },
                                                },
                                                { headerName: "DNA Rep1", field: "dna_rep1", type: "number" },
                                                { headerName: "RNA Rep1", field: "rna_rep1", type: "number" },
                                                { headerName: "RNA Rep2", field: "rna_rep2", type: "number" },
                                                { headerName: "RNA Rep3", field: "rna_rep3", type: "number" },
                                                {
                                                    headerName: "Log₂(Fold Change)",
                                                    field: "log2fc",
                                                    type: "number",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = e.row.log2fc) ? void 0 : n.toFixed(2);
                                                    },
                                                },
                                                {
                                                    headerName: "P-value",
                                                    field: "pvalue",
                                                    type: "number",
                                                    renderCell: (e) => (e.row.pvalue ? e.row.pvalue.toFixed(2) : "n/a"),
                                                },
                                                {
                                                    headerName: "FDR",
                                                    field: "fdr",
                                                    type: "number",
                                                    renderCell: (e) => (e.row.fdr ? e.row.fdr.toFixed(2) : "n/a"),
                                                },
                                            ],
                                            rows: null == I ? void 0 : I.capraFccSoloQuery,
                                            loading: k,
                                            error: !!_,
                                            initialState: {
                                                sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
                                            },
                                        }),
                                        (0, a.jsx)(l.XIK, {
                                            label: "STARR-seq (CAPRA quantification) Double Fragments",
                                            columns: [
                                                {
                                                    headerName: "cCRE Pair",
                                                    field: "ccrePair",
                                                    renderCell: (e) =>
                                                        (0, a.jsxs)(a.Fragment, {
                                                            children: [
                                                                (0, a.jsx)(o.g, {
                                                                    href: "/GRCh38/ccre/".concat(e.row.ccrep1),
                                                                    children: e.row.ccrep1,
                                                                }),
                                                                "-",
                                                                (0, a.jsx)(o.g, {
                                                                    href: "/GRCh38/ccre/".concat(e.row.ccrep2),
                                                                    children: e.row.ccrep2,
                                                                }),
                                                            ],
                                                        }),
                                                },
                                                {
                                                    headerName: "Experiment",
                                                    field: "a",
                                                    renderCell: (e) =>
                                                        (0, a.jsx)(o.g, {
                                                            href: "https://www.encodeproject.org/experiments/".concat(
                                                                e.row.experiment
                                                            ),
                                                            showExternalIcon: !0,
                                                            openInNewTab: !0,
                                                            children: e.row.experiment,
                                                        }),
                                                },
                                                {
                                                    headerName: "Celltype",
                                                    field: "b",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = x[e.row.experiment]) ? void 0 : n.cellType;
                                                    },
                                                },
                                                {
                                                    headerName: "Lab",
                                                    field: "c",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = x[e.row.experiment]) ? void 0 : n.lab;
                                                    },
                                                },
                                                { headerName: "DNA Rep1", field: "dna_rep1", type: "number" },
                                                { headerName: "RNA Rep1", field: "rna_rep1", type: "number" },
                                                { headerName: "RNA Rep2", field: "rna_rep2", type: "number" },
                                                { headerName: "RNA Rep3", field: "rna_rep3", type: "number" },
                                                {
                                                    headerName: "Log₂(Fold Change)",
                                                    field: "log2fc",
                                                    type: "number",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = e.row.log2fc) ? void 0 : n.toFixed(2);
                                                    },
                                                },
                                                {
                                                    headerName: "P-value",
                                                    field: "pvalue",
                                                    type: "number",
                                                    renderCell: (e) => (e.row.pvalue ? e.row.pvalue.toFixed(2) : "n/a"),
                                                },
                                                {
                                                    headerName: "FDR",
                                                    field: "fdr",
                                                    type: "number",
                                                    renderCell: (e) => (e.row.fdr ? e.row.fdr.toFixed(2) : "n/a"),
                                                },
                                            ],
                                            rows:
                                                (G &&
                                                    G.capraFccDoubleQuery.map((e) => ({
                                                        ...e,
                                                        ccrep1: H && H.cCREQuery.length > 0 && H.cCREQuery[0].accession,
                                                        ccrep2: H && H.cCREQuery.length > 0 && H.cCREQuery[1].accession,
                                                    }))) ||
                                                [],
                                            loading: M || P,
                                            error: !!F || !!D,
                                            initialState: {
                                                sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
                                            },
                                        }),
                                        (0, a.jsx)(l.XIK, {
                                            label: "CRISPR Perturbation Data",
                                            columns: [
                                                {
                                                    headerName: "Experiment",
                                                    field: "a",
                                                    renderCell: (e) =>
                                                        (0, a.jsx)(o.g, {
                                                            href: "https://www.encodeproject.org/experiments/".concat(
                                                                e.row.experiment
                                                            ),
                                                            showExternalIcon: !0,
                                                            openInNewTab: !0,
                                                            children: e.row.experiment,
                                                        }),
                                                },
                                                {
                                                    headerName: "Design",
                                                    field: "b",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = f[e.row.experiment]) ? void 0 : n.design;
                                                    },
                                                },
                                                {
                                                    headerName: "Celltype",
                                                    field: "c",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = f[e.row.experiment]) ? void 0 : n.cellType;
                                                    },
                                                },
                                                {
                                                    headerName: "Lab",
                                                    field: "d",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = f[e.row.experiment]) ? void 0 : n.lab;
                                                    },
                                                },
                                                {
                                                    headerName: "Log₂(Fold Change)",
                                                    field: "log2fc",
                                                    type: "number",
                                                    renderCell: (e) => {
                                                        var n;
                                                        return null == (n = e.row.log2fc) ? void 0 : n.toFixed(2);
                                                    },
                                                },
                                                {
                                                    headerName: "P-value",
                                                    field: "pvalue",
                                                    type: "number",
                                                    renderCell: (e) => (e.row.pvalue ? e.row.pvalue.toFixed(2) : "n/a"),
                                                },
                                                {
                                                    headerName: "FDR",
                                                    field: "fdr",
                                                    type: "number",
                                                    renderCell: (e) => (e.row.fdr ? e.row.fdr.toFixed(2) : "n/a"),
                                                },
                                            ],
                                            rows: null == T ? void 0 : T.crisprFccQuery,
                                            loading: A,
                                            error: !!w,
                                            initialState: {
                                                sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
                                            },
                                        }),
                                    ],
                                }),
                        ],
                    });
                };
        },
        98568: (e, n, t) => {
            t.d(n, { I: () => o });
            var a = t(52403),
                r = t(44945),
                l = t(1684),
                s = t(82293),
                i = t(2369);
            let o = (e) => {
                let { assembly: n, entityType: t, entityID: o } = e,
                    c = (0, a.V)({ name: o, entityType: t, assembly: n }),
                    d = (0, s.H)({ accession: o, entityType: t, assembly: n }),
                    u = (0, r.P)({ rsID: o, entityType: t, assembly: "GRCh38" }),
                    h = (0, i.z)({ study: [o], entityType: t });
                switch (t) {
                    case "gene":
                        return c;
                    case "ccre":
                        return d;
                    case "variant":
                        return u;
                    case "region":
                        try {
                            return { data: { coordinates: (0, l.oE)(o) }, loading: !1, error: void 0 };
                        } catch (e) {
                            return { data: void 0, loading: !1, error: e };
                        }
                    case "gwas":
                        return h;
                }
            };
        },
        98774: (e, n, t) => {
            t.d(n, { GWASStudySNPs: () => d });
            var a = t(95155),
                r = t(83982),
                l = t(80317),
                s = t(50301),
                i = t(51760),
                o = t(35448),
                c = t(40553);
            let d = (e) => {
                let { entity: n } = e,
                    { data: t, loading: d, error: u } = (0, o.Q)({ study: [n.entityID] }),
                    h = [
                        {
                            field: "snpid",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "SNP" }) }),
                            valueGetter: (e, n) => n.snpid,
                            renderCell: (e) =>
                                (0, a.jsx)(i.g, {
                                    href: "/GRCh38/variant/".concat(e.value),
                                    children: (0, a.jsx)("i", { children: e.value }),
                                }),
                        },
                        {
                            field: "chromosome",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Chromosome" }) }),
                            valueGetter: (e, n) => n.chromosome,
                        },
                        {
                            field: "start",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "Start" }) }),
                            valueGetter: (e, n) => n.start,
                        },
                        {
                            field: "ldblocksnpid",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "LD Block SNP ID" }) }),
                            valueGetter: (e, n) => n.ldblocksnpid,
                        },
                        {
                            field: "rsquare",
                            renderHeader: () =>
                                (0, a.jsx)("strong", {
                                    children: (0, a.jsxs)("p", {
                                        children: [
                                            (0, a.jsx)("i", { children: "R" }),
                                            (0, a.jsx)("sup", { children: "2" }),
                                        ],
                                    }),
                                }),
                            valueGetter: (e, n) => n.rsquare,
                        },
                        {
                            field: "ldblock",
                            renderHeader: () =>
                                (0, a.jsx)("strong", { children: (0, a.jsx)("p", { children: "LD Block" }) }),
                            valueGetter: (e, n) => n.ldblock,
                        },
                    ];
                return u
                    ? (0, a.jsx)(l.default, {
                          children: "Error Fetching Intersecting cCREs against SNPs identified by a GWAS study",
                      })
                    : (0, a.jsx)(a.Fragment, {
                          children: (0, a.jsx)(r.XIK, {
                              showToolbar: !0,
                              rows: t || [],
                              columns: h,
                              loading: d,
                              label: "SNPs identified by this GWAS study",
                              emptyTableFallback: "No SNPs identified by this GWAS study",
                              initialState: { sorting: { sortModel: [{ field: "rsquare", sort: "desc" }] } },
                              divHeight: { height: "100%", minHeight: "580px", maxHeight: "600px" },
                              labelTooltip: (0, a.jsx)(s.A, {
                                  title: "SNPs identified by selected GWAS study",
                                  children: (0, a.jsx)(c.A, { fontSize: "inherit" }),
                              }),
                          }),
                      });
            };
        },
    },
]);
