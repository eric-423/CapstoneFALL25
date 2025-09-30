'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { MapPin, Phone, Search } from 'lucide-react';

const FranchiseSection = () => {
  // Mock branch data - matching the design
  const branches = [
    {
      id: 1,
      name: "Tấm Tắc Làng Đại học",
      address: "Nhà văn hóa sinh viên, Khu đô thị Đại học Quốc gia TP. Hồ Chí Minh",
      phone: "0902-123-456",
      image: "/favicon.svg"
    },
    {
      id: 2,
      name: "Tấm Tắc Làng Đại học",
      address: "Nhà văn hóa sinh viên, Khu đô thị Đại học Quốc gia TP. Hồ Chí Minh",
      phone: "0902-123-456",
      image: "/favicon.svg"
    },
    {
      id: 3,
      name: "Tấm Tắc Làng Đại học",
      address: "Nhà văn hóa sinh viên, Khu đô thị Đại học Quốc gia TP. Hồ Chí Minh",
      phone: "0902-123-456",
      image: "/favicon.svg"
    }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#EBD187' }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-black"
            style={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: '53px'
            }}
          >
            HỆ THỐNG NHƯỢNG QUYỀN
          </h2>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
          {/* Branch Locations - Left side */}
          <div className="xl:w-2/3 space-y-6">
            {/* Location Search */}
            <div className="mb-6 flex flex-wrap gap-3">
              <Select defaultValue="tphcm">
                <SelectTrigger
                  className="w-full max-w-[195px] h-[41px]"
                  style={{
                    backgroundColor: '#EFE6DB',
                    borderRadius: '5px',
                    border: 'none'
                  }}
                >
                  <SelectValue placeholder="Tỉnh/Thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tphcm">Tỉnh/Thành phố</SelectItem>
                  <SelectItem value="hanoi">Hà Nội</SelectItem>
                  <SelectItem value="danang">Đà Nẵng</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="quan-huyen">
                <SelectTrigger
                  className="w-full max-w-[164px] h-[41px]"
                  style={{
                    backgroundColor: '#EFE6DB',
                    borderRadius: '5px',
                    border: 'none'
                  }}
                >
                  <SelectValue placeholder="Quận/Huyện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quan-huyen">Quận/Huyện</SelectItem>
                  <SelectItem value="quan-1">Quận 1</SelectItem>
                  <SelectItem value="quan-3">Quận 3</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Tìm theo khu vực"
                className="max-w-[225px] h-[41px]"
                style={{
                  backgroundColor: '#EFE6DB',
                  borderRadius: '5px',
                  border: 'none',
                  color: '#DA7339'
                }}
              />

              <Button
                className="w-[54px] h-[41px] p-0"
                style={{
                  backgroundColor: '#DA7339',
                  borderRadius: '5px'
                }}
              >
                <Search className="w-6 h-6" style={{ color: '#EFE6DB' }} />
              </Button>
            </div>

            {/* Stores List */}
            <div className="space-y-4 max-h-[507px] overflow-y-auto pr-2">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative w-full max-w-[610px] mx-auto"
                  style={{
                    height: '163px',
                    backgroundColor: '#EFE6DB',
                    borderRadius: '20px'
                  }}
                >
                  {/* Store Image */}
                  <div
                    className="absolute left-0 top-0 w-[180px] h-[163px] rounded-l-[15px] hidden sm:block"
                    style={{
                      backgroundImage: 'url(/images/content-1.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxShadow: 'inset -0.5px -0.5px 10.1px rgba(45, 30, 26, 0.2)'
                    }}
                  />

                  {/* Store Info */}
                  <div className="absolute left-0 sm:left-[223px] top-0 right-0 h-full p-4">
                    {/* Store Name */}
                    <h3
                      className="font-bold text-xl mb-2"
                      style={{
                        fontFamily: 'Playfair Display',
                        fontWeight: 700,
                        fontSize: '20px',
                        lineHeight: '27px',
                        color: '#2D1E1A'
                      }}
                    >
                      {branch.name}
                    </h3>

                    {/* Divider Line */}
                    <div
                      className="w-full h-px mb-2"
                      style={{ backgroundColor: '#2D1E1A' }}
                    />

                    {/* Address */}
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#78A243' }} />
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: 'Playfair Display',
                          fontSize: '15px',
                          lineHeight: '20px',
                          color: '#000000'
                        }}
                      >
                        {branch.address}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-4 h-4" style={{ color: '#78A243' }} />
                      <p
                        className="text-sm font-medium"
                        style={{
                          fontFamily: 'Playfair Display',
                          fontSize: '15px',
                          lineHeight: '20px',
                          color: '#000000'
                        }}
                      >
                        {branch.phone}
                      </p>
                    </div>

                    {/* Direction Button */}
                    <Button
                      className="absolute bottom-4 right-4 w-[144px] h-[55px] rounded-tl-[15px]"
                      style={{
                        backgroundColor: '#DA7339',
                        borderRadius: '15px 0px 0px 0px'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-6 h-6" style={{ color: '#EFE6DB' }} />
                        <span
                          className="text-sm"
                          style={{
                            fontFamily: 'Playfair Display',
                            fontSize: '15px',
                            lineHeight: '20px',
                            color: '#EFE6DB'
                          }}
                        >
                          Chỉ đường
                        </span>
                      </div>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Registration Form - Right side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="xl:w-1/3 w-full max-w-[479px] mx-auto xl:mx-0"
            style={{
              height: '565px',
              backgroundColor: '#EFE6DB',
              borderRadius: '20px'
            }}
          >
            {/* Logo */}
            <div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-[114px] h-[47px]"
              style={{ backgroundColor: '#EFE6DB' }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="font-bold text-lg"
                  style={{ color: '#2D1E1A' }}
                >
                  TẮM tắc
                </span>
              </div>
            </div>

            {/* Form Container */}
            <div
              className="m-6 p-6"
              style={{
                border: '3px solid #DA7339',
                borderRadius: '15px',
                height: '480px'
              }}
            >
              <h3
                className="text-center mb-4"
                style={{
                  fontFamily: 'Playfair Display',
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '27px',
                  color: '#2D1E1A'
                }}
              >
                ĐĂNG KÍ NHƯỢNG QUYỀN
              </h3>

              <p
                className="text-center mb-6 text-sm"
                style={{
                  fontFamily: 'Playfair Display',
                  fontSize: '15px',
                  lineHeight: '20px',
                  color: '#2D1E1A'
                }}
              >
                Nếu bạn quan tâm, hãy để lại thông tin liên lạc và người phụ trách của chúng tôi sẽ liên hệ hỗ trợ tư vấn về quy trình và các chính sách nhượng quyền tại Tấm Tắc.
              </p>

              {/* Registration Form */}
              <form className="space-y-4">
                <div>
                  <Input
                    placeholder="Họ và tên"
                    className="w-full h-[32px]"
                    style={{
                      backgroundColor: '#EFE6DB',
                      borderRadius: '5px',
                      border: '0.5px solid #2D1E1A',
                      color: '#DA7339',
                      fontFamily: 'Playfair Display',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="SĐT"
                    className="h-[32px]"
                    style={{
                      backgroundColor: '#EFE6DB',
                      borderRadius: '5px',
                      border: '0.5px solid #2D1E1A',
                      color: '#DA7339',
                      fontFamily: 'Playfair Display',
                      fontSize: '15px'
                    }}
                  />
                  <Input
                    placeholder="Email"
                    className="h-[32px]"
                    style={{
                      backgroundColor: '#EFE6DB',
                      borderRadius: '5px',
                      border: '0.5px solid #2D1E1A',
                      color: '#DA7339',
                      fontFamily: 'Playfair Display',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select>
                    <SelectTrigger
                      className="h-[32px]"
                      style={{
                        backgroundColor: '#EFE6DB',
                        borderRadius: '5px',
                        border: '0.5px solid #2D1E1A',
                        color: '#DA7339',
                        fontFamily: 'Playfair Display',
                        fontSize: '15px'
                      }}
                    >
                      <SelectValue placeholder="Khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="hanoi">Hà Nội</SelectItem>
                      <SelectItem value="danang">Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger
                      className="h-[32px]"
                      style={{
                        backgroundColor: '#EFE6DB',
                        borderRadius: '5px',
                        border: '0.5px solid #2D1E1A',
                        color: '#DA7339',
                        fontFamily: 'Playfair Display',
                        fontSize: '15px'
                      }}
                    >
                      <SelectValue placeholder="Mức vốn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Dưới 100 triệu</SelectItem>
                      <SelectItem value="medium">100-500 triệu</SelectItem>
                      <SelectItem value="high">Trên 500 triệu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="Ghi chú"
                  className="w-full h-[106px] resize-none"
                  style={{
                    backgroundColor: '#EFE6DB',
                    borderRadius: '5px',
                    border: '0.5px solid #2D1E1A',
                    color: '#DA7339',
                    fontFamily: 'Playfair Display',
                    fontSize: '15px'
                  }}
                />

                <Button
                  className="w-full h-[25px]"
                  style={{
                    backgroundColor: '#DA7339',
                    borderRadius: '5px',
                    fontFamily: 'Playfair',
                    fontWeight: 700,
                    fontSize: '15px',
                    lineHeight: '18px',
                    color: '#EFE6DB'
                  }}
                >
                  Gửi thông tin
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseSection;