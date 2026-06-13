import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H5, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import {
  deleteAlzheimerGame,
  fetchAlzheimerGames,
} from "../../Redux/stateSlice/alzheimerGamesReducer";
import { deleteGame, fetchGames } from "../../Redux/stateSlice/gamesReducer";

const FALLBACK_GAME_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='12' fill='%23f3f4f6'/%3E%3Cpath d='M36 45c0-4.97 4.03-9 9-9h30c4.97 0 9 4.03 9 9v30c0 4.97-4.03 9-9 9H45c-4.97 0-9-4.03-9-9V45Z' fill='%23d1d5db'/%3E%3Ccircle cx='49' cy='49' r='6' fill='%239ca3af'/%3E%3Cpath d='m47 73 11-12 9 9 6-7 11 10H47Z' fill='%236b7280'/%3E%3C/svg%3E";

// ─── Alzheimer game thumbnails (exact URL match) ──────────────────────────────
const ALZHEIMER_GAME_THUMBNAILS = {
  "https://games.careavatar.online/alzeimer/pattern-recognition/":
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  "https://games.careavatar.online/alzeimer/color-match-main/":
    "https://cdn-icons-png.flaticon.com/512/891/891419.png",
  "https://games.careavatar.online/alzeimer/bee-final-main/":
    "https://cdn-icons-png.flaticon.com/512/616/616408.png",
};

// ─── Alzheimer game thumbnails (keyword match) ────────────────────────────────
const ALZHEIMER_KEYWORD_THUMBNAILS = [
  {
    keys: ["pattern-recognition", "pattern recognition"],
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    keys: ["color match", "color-match", "color-match-main"],
    image: "https://cdn-icons-png.flaticon.com/512/891/891419.png",
  },
  {
    keys: ["spelling bee", "spelling-bee", "bee-final-main"],
    image: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  },
];

// ─── Autism game thumbnails (keyword match on label / link) ───────────────────
const AUTISM_KEYWORD_THUMBNAILS = [
  {
    keys: ["story builder", "story-builder"],
    // Book / storytelling icon
    image: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png",
  },
  {
    keys: ["memory quest", "memory-quest"],
    // Brain / memory icon
    image: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
  },
  {
    keys: ["math adventure", "math-adventure"],
    // Calculator / math icon
    image: "https://cdn-icons-png.flaticon.com/512/2344/2344103.png",
  },
  {
    keys: ["daily life", "daily-life", "daily life simulator"],
    // House / daily life icon
    image: "https://cdn-icons-png.flaticon.com/512/1946/1946436.png",
  },
  {
    keys: ["puzzle", "jigsaw"],
    image: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
  },
  {
    keys: ["emotion", "feeling", "social"],
    image: "https://cdn-icons-png.flaticon.com/512/4696/4696830.png",
  },
  {
    keys: ["color", "colour", "paint"],
    image: "https://cdn-icons-png.flaticon.com/512/891/891419.png",
  },
  {
    keys: ["music", "sound", "rhythm"],
    image: "https://cdn-icons-png.flaticon.com/512/3659/3659784.png",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sanitizeImageValue = (value) => {
  if (!value) return "";
  const normalized = String(value).trim();
  if (
    !normalized ||
    normalized === "undefined" ||
    normalized === "null" ||
    normalized === "[object Object]"
  ) {
    return "";
  }
  return normalized;
};

const stripTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const stripLeadingSlash = (value = "") => value.replace(/^\/+/, "");
const isAbsoluteUrl = (value = "") =>
  /^(https?:)?\/\//i.test(value) || /^(data|blob):/i.test(value);

const getBaseOrigin = (url = "") => {
  const clean = stripTrailingSlash(url);
  return clean.replace(/\/api\/?$/i, "");
};

const safeJoinUrl = (base, path) => {
  const cleanBase = stripTrailingSlash(base);
  const cleanPath = stripLeadingSlash(path);
  return `${cleanBase}/${cleanPath}`;
};

const normalizeUploadsPath = (value = "") => {
  const cleaned = value.trim();
  if (!cleaned) return "";
  if (/^\/uploads\//i.test(cleaned)) return cleaned;
  if (/^uploads\//i.test(cleaned)) return `/${cleaned}`;
  if (/^\/?api\/uploads\//i.test(cleaned)) {
    return `/${cleaned.replace(/^\/?api\//i, "")}`;
  }
  return `/uploads/${stripLeadingSlash(cleaned)}`;
};

const collectImageValues = (row) => {
  const rawValues = [
    row?.image?.url,
    row?.image?.path,
    row?.image?.secure_url,
    row?.image?.location,
    row?.image,
    row?.filepath,
    row?.filePath,
    row?.path,
    row?.url,
    row?.imageUrl,
    row?.image_url,
    row?.thumbnail?.url,
    row?.thumbnail?.path,
    row?.thumbnail,
    row?.thumbnailUrl,
    row?.thumbnail_url,
    row?.gameImage?.url,
    row?.gameImage?.path,
    row?.gameImage,
    row?.coverImage?.url,
    row?.coverImage?.path,
    row?.coverImage,
    row?.file?.url,
    row?.file?.path,
    row?.file,
  ]
    .map(sanitizeImageValue)
    .filter(Boolean);

  return [...new Set(rawValues)];
};

// ─── Main DataTableComponent ──────────────────────────────────────────────────
const DataTableComponent = ({ gameType = "alzheimer", title = "Alzheimer Games" }) => {
  const [viewData, setViewData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const isAlzheimer = gameType === "alzheimer";

  const alzheimerState = useSelector((state) => state.alzheimerGames || {});
  const autismState = useSelector((state) => state.allGames || {});
  const activeState = isAlzheimer ? alzheimerState : autismState;

  const {
    loading = false,
    games = [],
    error = "",
    pagination = {},
    deleteLoading = false,
  } = activeState;

  const apiBase = useMemo(() => stripTrailingSlash(BASE_URL || ""), []);
  const fileBase = useMemo(() => getBaseOrigin(BASE_URL || ""), []);

  // ── Resolve thumbnail for a row ─────────────────────────────────────────────
  const getOnlineGameThumbnail = (row) => {
    const gameLink = sanitizeImageValue(row?.link_for_game || row?.link || "");
    const rowTitle = sanitizeImageValue(row?.title || row?.label || "").toLowerCase();
    const description = sanitizeImageValue(row?.description || "").toLowerCase();
    const rowText = `${rowTitle} ${description} ${gameLink}`.toLowerCase();

    if (isAlzheimer) {
      if (gameLink && ALZHEIMER_GAME_THUMBNAILS[gameLink]) {
        return ALZHEIMER_GAME_THUMBNAILS[gameLink];
      }
      const kwMatch = ALZHEIMER_KEYWORD_THUMBNAILS.find((thumbnail) =>
        thumbnail.keys.some((key) => rowText.includes(key))
      );
      if (kwMatch) return kwMatch.image;
    } else {
      const kwMatch = AUTISM_KEYWORD_THUMBNAILS.find((thumbnail) =>
        thumbnail.keys.some((key) => rowText.includes(key))
      );
      if (kwMatch) return kwMatch.image;
      return "https://cdn-icons-png.flaticon.com/512/3004/3004458.png";
    }

    return "";
  };

  const getGameImageCandidates = (row) => {
    const imageValues = collectImageValues(row);
    const onlineThumbnail = getOnlineGameThumbnail(row);

    const candidates = imageValues.flatMap((imageValue) => {
      if (isAbsoluteUrl(imageValue)) {
        return [imageValue];
      }

      const strippedValue = stripLeadingSlash(imageValue);
      const normalizedUploadsPath = normalizeUploadsPath(imageValue);

      if (imageValue.startsWith(apiBase)) {
        return [imageValue];
      }

      if (/^\/?api\/uploads\//i.test(imageValue)) {
        const normalized = imageValue.replace(/^\/?api\//i, "");
        return [safeJoinUrl(fileBase, normalized)];
      }

      return [
        safeJoinUrl(fileBase, imageValue),
        safeJoinUrl(fileBase, normalizedUploadsPath),
        safeJoinUrl(fileBase, strippedValue),
        safeJoinUrl(apiBase, strippedValue),
        safeJoinUrl(apiBase, normalizedUploadsPath),
      ];
    });

    // Uploaded image first → online thumbnail → fallback
    return [
      ...new Set([...candidates, onlineThumbnail, FALLBACK_GAME_IMAGE].filter(Boolean)),
    ];
  };

  const getNextImageCandidate = (event) => {
    const candidates = (event.currentTarget.dataset.imageCandidates || "")
      .split("|")
      .filter(Boolean);
    const currentIndex = Number(event.currentTarget.dataset.imageIndex || 0);
    const nextIndex = currentIndex + 1;
    event.currentTarget.dataset.imageIndex = String(nextIndex);
    return candidates[nextIndex] || FALLBACK_GAME_IMAGE;
  };

  const EditModaltoggle = (data = null) => {
    setViewData(data);
    setEditModal((prev) => !prev);
  };

  const Modaltoggle = () => {
    setViewModal((prev) => !prev);
  };

  useEffect(() => {
    dispatch(
      isAlzheimer ? fetchAlzheimerGames(currentPage, 10) : fetchGames(currentPage, 10)
    );
  }, [dispatch, currentPage, isAlzheimer]);

  const handleDelete = async (id, rowTitle) => {
    const shouldDelete = window.confirm(
      `Delete "${rowTitle || "this game"}"? This action cannot be undone.`
    );
    if (!shouldDelete) return;

    try {
      await dispatch(isAlzheimer ? deleteAlzheimerGame(id) : deleteGame(id));
      const remainingRecords = games.length - 1;
      if (remainingRecords === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await dispatch(
          isAlzheimer ? fetchAlzheimerGames(currentPage, 10) : fetchGames(currentPage, 10)
        );
      }
    } catch (deleteError) {
      console.error("Delete failed:", deleteError);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner attrSpinner={{ className: "loader-5" }} />
        </div>
      </Col>
    );
  }

  const CustomOption = ({ row }) => (
    <div className="d-flex">
      <button
        className="btn btn-light p-2 mx-1"
        onClick={() => EditModaltoggle(row)}
        type="button"
      >
        <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-edit" />
      </button>
      <button
        className="btn btn-light p-2 mx-1"
        onClick={() => handleDelete(row?._id, row?.title || row?.label)}
        disabled={deleteLoading}
        type="button"
      >
        <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-trash-o" />
      </button>
    </div>
  );

  const tableColumns = [
    {
      name: "Image",
      sortable: false,
      width: "120px",
      cell: (row) => {
        const candidates = getGameImageCandidates(row);
        return (
          <div className="avatar">
            <Image
              attrImage={{
                className: "rounded",
                src: candidates[0] || FALLBACK_GAME_IMAGE,
                alt: row?.title || row?.label || "game",
                "data-image-candidates": candidates.join("|"),
                "data-image-index": "0",
                style: {
                  width: "88px",
                  height: "56px",
                  objectFit: "cover",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                },
                onError: (event) => {
                  event.currentTarget.src = getNextImageCandidate(event);
                },
              }}
            />
          </div>
        );
      },
    },
    {
      name: "Title",
      selector: (row) => row?.title || row?.label || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Description",
      selector: (row) => row?.description || "-",
      sortable: true,
      grow: 2,
      cell: (row) => {
        const description = row?.description || "-";
        return (
          <span title={description}>
            {description.slice(0, 50)}
            {description.length > 50 ? "..." : ""}
          </span>
        );
      },
    },
    {
      name: "Game Link",
      selector: (row) => row?.link_for_game || row?.link || "-",
      sortable: true,
      cell: (row) => {
        const gameLink = row?.link_for_game || row?.link;
        return gameLink ? (
          <a
            href={gameLink}
            target="_blank"
            rel="noreferrer"
            className="text-primary"
            style={{ wordBreak: "break-word" }}
          >
            {gameLink}
          </a>
        ) : (
          "-"
        );
      },
    },
    {
      name: "Category",
      selector: (row) => row?.category || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Points",
      selector: (row) => row?.total_point || 0,
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      sortable: false,
      cell: () => <span className="badge badge-light-success">Active</span>,
    },
    {
      name: "Option",
      center: true,
      minWidth: "150px",
      button: true,
      cell: (row) => <CustomOption row={row} />,
    },
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2">
        <H5 attrH4={{ className: "text-muted m-0" }}>{title}</H5>
        <Btn attrBtn={{ color: "primary", onClick: Modaltoggle }}>Add Game</Btn>
      </div>

      {error ? <p className="text-danger px-2">{error}</p> : null}

      <DataTable
        data={Array.isArray(games) ? games : []}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        paginationTotalRows={
          pagination?.totalItems ||
          pagination?.totalGames ||
          pagination?.totalUsers ||
          pagination?.total ||
          (Array.isArray(games) ? games.length : 0)
        }
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        progressPending={deleteLoading}
        noDataComponent="No games found"
      />

      <AddModal
        viewModal={viewModal}
        setViewModal={setViewModal}
        Modaltoggle={Modaltoggle}
        gameType={gameType}
      />

      <EditModal
        category={viewData}
        editModal={editModal}
        setEditModal={setEditModal}
        EditModaltoggle={EditModaltoggle}
        currentPage={currentPage}
        gameType={gameType}
      />
    </Fragment>
  );
};

export default DataTableComponent;
