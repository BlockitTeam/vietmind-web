import { Benefits } from "@/components/Benefits";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { Testimonials } from "@/components/Testimonials";
import { SectionTitle } from "@/components/SectionTitle";
import { benefitOne } from "@/components/data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Our } from "@/components/Our";


export default function Home() {
  return (
    <>
      <Navbar />
      <Container className="bg-gradient-to-r from-[#344e41] to-[#54a57a] p-20">
        <Hero />
      </Container>
      <Container>
        <Benefits data={benefitOne} />
      </Container>
      <Container className="mb-5">
        <h1 className="text-center my-5 text-2xl font-bold">Về chúng tôi</h1>
        <Our />
      </Container>
      <Container >
        <SectionTitle
          preTitle="Kết nối với chúng tôi."
          title="VietMind"
        >
          <div className="mb-5">Chúng tôi rất trân trọng sự ủng hộ của bạn dành cho VietMind với vai trò đối tác, nhà trị liệu hoặc người bạn đồng hành.
            Chúng tôi luôn tìm kiếm những người mong muốn góp phần vào sứ mệnh của mình – giúp liệu pháp tâm lý trở nên dễ tiếp cận hơn tại Việt Nam.
            Vui lòng liên hệ với chúng tôi qua email: vt.therapy.co@gmail.com</div>
        </SectionTitle>
      </Container>
      <Container className="bg-gradient-to-r from-[#344e41] to-[#54a57a] p-2 ">
        <h1 className="text-center my-5 text-2xl font-bold text-white w-2/4 mx-auto">Chatbot hỗ trợ bởi AI được thiết kế và chứng nhận bởi các nhà trị liệu chuyên nghiệp.</h1>
        <Testimonials />
      </Container>
      <Footer />
    </>
  );
}
