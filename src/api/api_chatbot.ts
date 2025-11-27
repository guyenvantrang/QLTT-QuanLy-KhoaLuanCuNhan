import axios from "axios";

const API_URL = "http://localhost:8002";
export interface ChatResponse {
  session_id: string;
  response: string;
}
export async function AskAssistant(user_input: string, session_id: string) {
  try {
    const res = await axios.post(`${API_URL}/qa/ask`, {
      user_input,
      session_id
    });
    return res.data; 
  } catch (err: any) {
    if (err.response?.data?.detail) throw new Error(err.response.data.detail);
    throw new Error("Đã xảy ra lỗi khi gửi yêu cầu đến trợ lý AI.");
  }
}


export async function Chat_GetAll(session_id: string) {
  try {
    const res = await axios.post(`${API_URL}/conversation/chat/all`, { session_id });
    return res.data; 
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Lỗi lấy lịch sử chat");
  }
}



export async function Chat_GetUniqueQuestions() {
  try {
    const res = await axios.post(`${API_URL}/conversation/get_unique_questions`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Lỗi lấy unique questions");
  }
}



export async function Chat_Clear(session_id: string) {
  try {
    const res = await axios.delete(`${API_URL}/conversation/chat/clear`, {
      params: { session_id }
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Không thể xóa lịch sử chat");
  }
}


export async function Chat_UpdateRead(
  session_id: string,
  chat_id: string,
  read: boolean
) {
  try {
    const res = await axios.post(`${API_URL}/conversation/chat/update-read`, {
      session_id,
      chat_id,
      read
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Không thể cập nhật trạng thái đọc.");
  }
}






// thêm chủ đề cho dữ liệu chat bot
export async function addToCollectionName(
  keyword_vi: string,// keyword tiếng việt 
  keyword: string, // keyword không dấu không cách và không trùng 
  texts: string[] // danh danh các nội dung của chủ để học 
) {
  try {
    const res = await axios.post(`${API_URL}/topic/add_to_collection_name`, {
      keyword_vi,
      keyword,
      texts
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi khi thêm vào collection.");
  }
}


// nội dung của chủ đề , xóa nhiều cùng 1 lúc 
export async function deleteFromCollectionName(ids: string[]) {
  try {
    const res = await axios.delete(`${API_URL}/topic/delete_from_collection_name`, {
      data: { ids } // DELETE phải dùng "data"
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi khi xoá dữ liệu theo ID.");
  }
}


// xóa nội dung của chủ đề nhưng xóa 1 
export async function deleteFromCollectionByKeyword(keyword: string) {
  try {
    const res = await axios.delete(`${API_URL}/topic/delete_from_collection_by_keyword`, {
      data: { keyword }
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi khi xoá theo keyword.");
  }
}


// lấy tất cả nội dung chuyền vào keyword
export async function getAllKeywordsFromCollection(keyword: string) {
  try {
    const res = await axios.post(`${API_URL}/topic/get_all_keywords_from_collection`, {
      keyword
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi khi lấy danh sách keyword.");
  }
}



// lấy tất cả keyword 
export async function showAllKeywordsFromCollection() {
  try {
    const res = await axios.post(`${API_URL}/topic/show_all_keywords_from_collection`);
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi khi lấy danh sách keyword.");
  }
}

// thêm dữ liệu cho ai học 
export async function addManually(
  collection_name: string, // chuyền vào keyword của chủ đề 
  texts: string[], // 1 danh sách dữ liệu 
  source?: string, // hình thức thêm 
  label?: string, // tiêu đề 
  description?: string // mô tả 
) {
  try {
    const res = await axios.post(`${API_URL}/data/add_manually`, {
      collection_name,
      texts,
      source,
      label,
      description,
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi khi thêm dữ liệu vào collection.");
  }
}


// chọn keyword chủ đề và danh sách ids nội dung của data để xóa 
export async function deleteById(collection_name: string, ids: string[]) {
  try {
    const res = await axios.delete(`${API_URL}/data/delete_by_id`, {
      data: { collection_name, ids },
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi khi xóa theo ID.");
  }
}


// lấy tất cả data , lấy theo kiểu tương đối , phục vụ cho tìm kiếm tương đối
export async function getAllData(payload: {
  list_collection_names: string[];
  id?: string;
  source?: string;
  label?: string;
  description?: string;
  create_at?: string;
}) {
  try {
    const res = await axios.post(`${API_URL}/data/get_all_data`, payload);
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi khi tải toàn bộ dữ liệu.");
  }
}

// xóa nội dung data dựa vào source 
export async function deleteBySource(collection_name: string, source: string) {
  try {
    const res = await axios.delete(`${API_URL}/data/delete_by_source`, {
      data: { collection_name, source },
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi xoá theo source.");
  }
}


// thêm dữ liệu data bằng file pdf , docx , txt
export async function addPdfToCollection(
  collection_name: string,
  file: File,
  label?: string,
  description?: string
) {
  const form = new FormData();
  form.append("collection_name", collection_name);
  if (label) form.append("label", label);
  if (description) form.append("description", description);
  form.append("file", file);

  try {
    const res = await axios.post(`${API_URL}/data/add_pdf_to_collection`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Lỗi khi upload PDF vào collection.");
  }
}
