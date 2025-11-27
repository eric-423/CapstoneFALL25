"use client";

import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Branch,
  GET_BRANCHES_QUERY_KEY,
  GET_BRANCHES_STALE_TIME,
  getBranches,
} from "@/apis/branch.api";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});
const FranchiseSection = () => {
  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: [GET_BRANCHES_QUERY_KEY, "home-franchise"],
    queryFn: () => getBranches(),
    staleTime: GET_BRANCHES_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <section className="py-20 bg-[#FFFCF7]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold text-black ${montserrat.className}`}
            style={{
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: "53px",
            }}
          >
            HỆ THỐNG NHƯỢNG QUYỀN
          </h2>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
          <div className="xl:w-2/3 space-y-6">
            <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2">
              {isLoading && (
                <div className="flex items-center justify-center py-8 text-sm text-gray-700">
                  Đang tải danh sách chi nhánh...
                </div>
              )}

              {!isLoading &&
                branches.map((branch, index) => (
                  <motion.div
                    key={branch.id}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative w-full max-w-[610px] mx-auto"
                    style={{
                      height: "163px",
                      backgroundColor: "#EFE6DB",
                      borderRadius: "20px",
                    }}
                  >
                    <div className="h-full p-4">
                      <h3
                        className="font-bold text-xl mb-2"
                        style={{
                          fontFamily: "Playfair Display",
                          fontWeight: 700,
                          fontSize: "20px",
                          lineHeight: "27px",
                          color: "#2D1E1A",
                        }}
                      >
                        {branch.name}
                      </h3>
                      <div
                        className="w-full h-px mb-2"
                        style={{ backgroundColor: "#2D1E1A" }}
                      />
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin
                          className="w-4 h-4 mt-1 flex-shrink-0"
                          style={{ color: "#78A243" }}
                        />
                        <p
                          className={`text-sm ${montserrat.className}`}
                          style={{
                            fontSize: "15px",
                            lineHeight: "20px",
                            color: "#000000",
                          }}
                        >
                          {branch.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Phone
                          className="w-4 h-4"
                          style={{ color: "#78A243" }}
                        />
                        <p
                          className="text-sm font-medium"
                          style={{
                            fontFamily: "Playfair Display",
                            fontSize: "15px",
                            lineHeight: "20px",
                            color: "#000000",
                          }}
                        >
                          {branch.phone}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="xl:w-1/3 w-full max-w-[479px] mx-auto xl:mx-0 relative"
            style={{
              height: "265px",
              backgroundColor: "#EFE6DB",
              borderRadius: "20px",
            }}
          >
            <div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-[114px] h-[47px]"
              style={{ backgroundColor: "#EFE6DB" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="font-bold text-lg"
                  style={{ color: "#2D1E1A" }}
                >
                  TẤM TẮC
                </span>
              </div>
            </div>
            <div
              className="m-6 p-6"
              style={{
                border: "3px solid #DA7339",
                borderRadius: "15px",
                height: "200px",
              }}
            >
              <h3
                className="text-center mb-4"
                style={{
                  fontFamily: "Playfair Display",
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "27px",
                  color: "#2D1E1A",
                }}
              >
                ĐĂNG KÍ NHƯỢNG QUYỀN
              </h3>

              <p
                className="text-center mb-6 text-sm"
                style={{
                  fontFamily: "Playfair Display",
                  fontSize: "15px",
                  lineHeight: "20px",
                  color: "#2D1E1A",
                }}
              >
                Nếu bạn quan tâm, hãy liên lạc với người phụ trách của chúng tôi
                sẽ liên hệ hỗ trợ tư vấn về quy trình và các chính sách nhượng
                quyền tại Tấm Tắc.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseSection;
