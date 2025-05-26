import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  UploadCloud,
  Heart,
  Link as LinkIcon,
  Copy,
  Printer,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import toast from "react-hot-toast";
import { NO_IMAGE, UPLOADS_URL } from "../api/urls";
import useAddTable from "../hooks/useAddTable";
import useUpdateTable from "../hooks/useUpdateTable";
import useGetTables from "../hooks/useGetTables";
import useDeleteTable from "../hooks/useDeleteTable";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";

// Define TypeScript interface for table
interface Table {
  id: string;
  name: string;
  description: string;
  image: string;
}

const Tables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null); // For QR code modal
  const [likedTables, setLikedTables] = useState<Record<string, boolean>>({}); // Track likes per table

  const { addTable } = useAddTable();
  const { updateTable } = useUpdateTable();
  const { getTables } = useGetTables();
  const { deleteTable } = useDeleteTable();

  const [reload, setReload] = useState(false);

  // Improved filtering logic
  const filteredTables = tables.filter(
    (table) =>
      (table.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      table
  );

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getTables();
        setTables(data.tables);
      } catch (error) {
        console.error("Failed to load tables:", error);
        toast.error("Failed to load tables. Please try again.");
      }
    };
    load();
  }, [reload]);

  // Form state
  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const handleAddTable = () => {
    console.log("Opening Add Table modal");
    setEditingTable(null);
    setFormData({
      name: "",
      description: "",
      image: "",
    });
    setImage(null);
    setShowModal(true);
  };

  const handleEditTable = (table: Table) => {
    console.log("Opening Edit Table modal for:", table);
    setEditingTable(table);
    setFormData({
      name: table.name,
      description: table.description,
      image: table.image,
    });
    setImage(null); // Reset image file
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await updateTable(formData, image, editingTable.id);
        toast.success("Table updated successfully");
      } else {
        await addTable(formData, image);
        toast.success("Table added successfully");
      }
      setShowModal(false);
      setReload(!reload);
    } catch (error: any) {
      toast.error(error.message || "Failed to process table");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTable(id);
      toast.success("Table deleted successfully");
      setReload(!reload);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete table");
    }
  };

  const handleCopyLink = (tableId: string) => {
    const tableUrl = getTableUrl(tableId);
    navigator.clipboard
      .writeText(tableUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };

  const handleToggleLike = (tableId: string) => {
    setLikedTables((prev) => ({
      ...prev,
      [tableId]: !prev[tableId],
    }));
  };

  const handlePrintQR = () => {
    window.print();
  };

  // Generate table URL for QR code and link display
  const getTableUrl = (tableId: string) => {
    const baseUrl = window.location.origin || "https://your-app-domain.com";
    const url = `${baseUrl}/table/${tableId}`;
    console.log("Generated QR code URL:", url); // Debug URL
    return url;
  };

  return (
    <>
      {/* Print-specific stylesheet */}
      <style media="print">{`
        @media print {
          body * {
            visibility: hidden;
          }
          #qr-code-svg, #qr-code-svg * {
            visibility: visible;
          }
          #qr-code-svg {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 300px;
            padding: 10px;
            background: white;
            border: 1px solid #e5e7eb;
          }
        }
      `}</style>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to="/products">
              <Button variant="ghost" size="icon" aria-label="Back to products">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Tables
              </h1>
              <p className="text-muted-foreground">Manage your tables</p>
            </div>
          </div>

          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleAddTable}
            aria-label="Add new table"
          >
            Add Table
          </Button>
        </div>

        {/* Search box */}
        <div className="max-w-md">
          <Input
            placeholder="Search tables..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={
              searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Tables grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTables.map((table) => (
            <Card key={table.id} className="overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={table.image ? `${UPLOADS_URL}${table.image}` : NO_IMAGE}
                  alt={`Image of ${table.name}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40"></div>
                  <h3 className="relative z-10 text-xl font-bold text-white">
                    {table.name}
                  </h3>
                </div>
              </div>

              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {table.description || "No description available"}
                </p>

                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Pencil className="h-3.5 w-3.5" />}
                    onClick={() => handleEditTable(table)}
                    aria-label={`Edit ${table.name}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    onClick={() => handleDelete(table.id)}
                    aria-label={`Delete ${table.name}`}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={
                      <Heart
                        className={`h-3.5 w-3.5 ${
                          likedTables[table.id]
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    }
                    onClick={() => handleToggleLike(table.id)}
                    aria-label={
                      likedTables[table.id] ? "Unlike table" : "Like table"
                    }
                  >
                    {likedTables[table.id] ? "Unlike" : "Like"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<LinkIcon className="h-3.5 w-3.5" />}
                    onClick={() => handleCopyLink(table.id)}
                    aria-label={`Copy link for ${table.name}`}
                  >
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTableId(table.id);
                      console.log(
                        "Opening QR modal for table ID:",
                        table.id,
                        "URL:",
                        getTableUrl(table.id)
                      );
                    }}
                    aria-label={`Show QR code for ${table.name}`}
                  >
                    Show QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom QR Code Modal */}
        {selectedTableId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 transition-opacity duration-300">
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              onClick={() => setSelectedTableId(null)}
              aria-label="Close QR code modal"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedTableId(null);
                }
              }}
            ></div>

            {/* Modal Content */}
            <div
              id="qr-print-area"
              className="relative bg-background rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-border"
            >
              <button
                className="absolute top-4 right-4 text-foreground/70 hover:text-foreground transition-colors duration-200"
                onClick={() => setSelectedTableId(null)}
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-foreground mb-6">
                QR Code for{" "}
                {tables.find((t) => t.id === selectedTableId)?.name || "Table"}
              </h2>

              <div className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  {selectedTableId ? (
                    <div className="qr-code-container bg-background border border-border rounded-lg shadow-sm p-4">
                      <QRCodeSVG
                        id="qr-code-svg"
                        value={getTableUrl(selectedTableId)}
                        size={200}
                        className="w-full max-w-[200px] h-auto"
                        bgColor="transparent"
                        fgColor={
                          document.documentElement.classList.contains("dark")
                            ? "#e5e7eb"
                            : "#1f2937"
                        }
                        onError={() =>
                          console.error(
                            "Failed to render QR code for URL:",
                            getTableUrl(selectedTableId)
                          )
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-red-500 text-center">
                      Error: No table selected for QR code
                    </p>
                  )}
                </div>

                {/* Display Link and Buttons */}
                {selectedTableId && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-muted p-3 rounded-lg">
                      <p className="text-sm text-foreground break-all qr-link">
                        {getTableUrl(selectedTableId)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Copy className="h-4 w-4" />}
                        onClick={() => handleCopyLink(selectedTableId)}
                        aria-label="Copy table link"
                        className="hover:bg-muted/80 transition-colors duration-200"
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="modal-buttons flex justify-end gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Printer className="h-4 w-4" />}
                        onClick={handlePrintQR}
                        aria-label="Print QR code"
                        className="hover:bg-muted/80 transition-colors duration-200"
                      >
                        Print QR
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Table Modal */}
        <Transition show={showModal} as="div">
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            className="relative z-50"
          >
            {/* Backdrop */}
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            </Transition.Child>

            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl border border-border">
                  <DialogTitle
                    as="h2"
                    className="text-lg font-bold text-foreground mb-4"
                  >
                    {editingTable ? "Edit Table" : "Add New Table"}
                  </DialogTitle>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Table Name"
                      placeholder="Enter table name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />

                    <Input
                      label="Description"
                      placeholder="Enter table description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Table Image"
                      type="file"
                      onChange={(e) =>
                        setImage(e.target.files ? e.target.files[0] : null)
                      }
                      leftIcon={<UploadCloud className="h-4 w-4" />}
                      accept="image/*"
                    />

                    {image && (
                      <div className="mt-2 rounded-md overflow-hidden border border-border">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Table preview"
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}

                    {editingTable && formData.image && !image && (
                      <div className="mt-2 rounded-md overflow-hidden border border-border">
                        <img
                          src={`${UPLOADS_URL}${formData.image}`}
                          alt="Current table image"
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = NO_IMAGE;
                          }}
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setShowModal(false)}
                        aria-label="Cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        aria-label={editingTable ? "Update table" : "Add table"}
                      >
                        {editingTable ? "Update Table" : "Add Table"}
                      </Button>
                    </div>
                  </form>
                </DialogPanel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

export default Tables;
