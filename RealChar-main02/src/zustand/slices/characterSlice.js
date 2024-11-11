import { 
  cloneVoice, // 复制声音功能
  createCharacter, // 创建角色功能
  generateSystemPrompt, // 生成系统提示词功能
  uploadFile, // 上传文件功能
  getCharacter, // 获取角色功能
  deleteCharacter, // 删除角色功能
  editCharacter // 编辑角色功能
} from '@/util/apiClient'; // 从 util/apiClient 引入 API 调用方法
import { edgeTTSVoiceIds } from '../voiceIds'; // 引入边缘 TTS 语音 ID 配置

// 定义用户提示模板，作为交互时的模板
const user_prompt = `
Context
  ---
  {context}
  ---
  Use previous information as context to answer the following user question. Aim to keep responses super super concise and meaningful and try to express emotions.
  ALWAYS ask clarification questions when:
  - the user's question isn't clear,
  - seems unfinished,
  - seems totally irrelevant.
  ---
  {query}
`;

// 构建表单数据的函数，异步执行，确保表单的完整性
const constructForm = async (get) => {
  if (!get().formData.name) {
    alert('Please enter a name'); // 如果未填写名称，提示用户输入名称
    return;
  }
  let new_formData = { ...get().formData }; // 深拷贝表单数据
  if (!new_formData.data) {
    new_formData.data = {}; // 初始化 data 对象
  }

  // 如果语音 ID 是占位符，调用 cloneVoice API 复制语音
  if (new_formData.voice_id === 'placeholder') {
    new_formData.voice_id = await cloneVoice(get().voiceFiles, get().token);
  }

  // 上传头像文件到云存储
  if (get().avatarFile) {
    try {
      let res = await uploadFile(get().avatarFile, get().token); // 上传文件
      new_formData.data.avatar_filename = res.filename; // 存储上传成功后的文件名
    } catch (error) {
      console.error(error);
      alert('Error uploading image'); // 上传失败提示错误
    }
  }

  // 上传背景文件到云存储
  if (get().backgroundFiles.length > 0) {
    for (let i = 0; i < get().backgroundFiles.length; i++) {
      try {
        let res = await uploadFile(get().backgroundFiles[i], get().token); // 上传每个背景文件
        new_formData.data[get().backgroundFiles[i].name] = res.filename; // 存储文件名
      } catch (error) {
        console.error(error);
        alert('Error uploading files'); // 上传失败提示错误
      }
    }
  }
  new_formData.background_text = get().backgroundText; // 将背景文本加入表单数据
  return new_formData; // 返回构建完成的表单数据
};

// 创建角色的 Zustand 状态切片
export const createCharacterSlice = (set, get) => ({
  avatarURL: null, // 头像的 URL
  avatarFile: null, // 头像文件
  formData: {
    name: '', // 角色名称
    system_prompt: '', // 系统提示词
    user_prompt: user_prompt, // 用户提示词
    tts: 'ELEVEN_LABS', // 默认使用 Eleven Labs 作为文本转语音引擎
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // 默认语音 ID
    visibility: 'private', // 角色可见性，默认为私有
  },
  backgroundText: '', // 背景文本
  backgroundFiles: [], // 背景文件数组
  errorMsg: '', // 错误信息
  voiceErrorMsg: '', // 语音相关的错误信息
  clonedVoice: '', // 复制的语音 ID
  voiceFiles: [], // 上传的语音文件数组
  ttsOptions: [ // 可选的文本转语音引擎配置
    {
      value: 'ELEVEN_LABS',
      text: 'Eleven Labs',
      selected_voice_id: 'EXAVITQu4vr4xnSDxMaL', // 默认选择的 Eleven Labs 语音 ID
    },
    {
      value: 'GOOGLE_TTS',
      text: 'Google TTS',
      selected_voice_id: 'en-US-Studio-O', // 默认 Google TTS 语音 ID
    },
    {
      value: 'EDGE_TTS',
      text: 'Edge TTS',
      selected_voice_id: 'en-US-ChristopherNeural', // 默认 Edge TTS 语音 ID
    },
  ],
  voiceOptions: { // 各文本转语音引擎的可选语音配置
    ELEVEN_LABS: [
      { voice_id: 'EXAVITQu4vr4xnSDxMaL', gender: 'Female', name: 'Default' },
      { voice_id: 'ErXwobaYiN019PkySvjV', gender: 'Male', name: 'Default' },
    ],
    GOOGLE_TTS: [
      { voice_id: 'en-US-Studio-O', gender: 'Female', name: 'Default' },
      { voice_id: 'en-US-Studio-M', gender: 'Male', name: 'Default' },
    ],
    EDGE_TTS: edgeTTSVoiceIds.map((item) => ({
      voice_id: item.voice_id,
      lang: item.lang,
      gender: item.gender,
      name: item.name + ' (' + item.from + ')', // 显示语言和语音来源
      audio_url: 'https://storage.googleapis.com/assistly/static/edge-tts-samples/' + item.voice_id + '.mp3',
    })),
  },
  voiceFilters: { // 各引擎的过滤选项，基于性别或语言
    ELEVEN_LABS: [{ label: 'gender', value: 'Female' }],
    GOOGLE_TTS: [{ label: 'gender', value: 'Female' }],
    EDGE_TTS: [{ label: 'lang', value: 'English' }, { label: 'gender', value: 'Male' }],
  },
  voiceOptionsMode: 'selectVoice', // 当前语音选择模式
  voiceSamplePlayer: undefined, // 语音示例播放器实例
  voiceSampleUrl: '', // 当前语音示例的 URL

  // 设置表单数据
  setFormData: (newData) => {
    set((state) => ({
      formData: { ...state.formData, ...newData }, // 更新表单数据
    }));
  },

  // 设置背景文本
  setBackgroundText: (value) => {
    set({ backgroundText: value });
  },

  // 设置背景文件
  setBackgroundFiles: (files) => {
    set({ backgroundFiles: files });
  },

  // 设置错误消息
  setErrorMsg: (text) => {
    set({ errorMsg: text });
  },

  // 设置语音选择模式
  setVoiceOptionsMode: (mode) => {
    set({ voiceOptionsMode: mode });
    if (mode === 'selectVoice') {
      get().setFormData({ voice_id: get().getCurrentVoiceOption().voice_id }); // 更新语音 ID
    } else if (get().isClonedVoice(get().clonedVoice) && mode === get().clonedVoice) {
      get().setFormData({ voice_id: get().clonedVoice });
    }
  },

  // 设置语音示例播放器
  setVoiceSamplePlayer: (player) => {
    set({ voiceSamplePlayer: player });
  },

  // 获取语音过滤选项
  getVoiceFilterOptions: (filter) => {
    return get()
      .voiceOptions[get().formData.tts] // 获取当前引擎下的语音选项
      .map((option) => option[filter.label]) // 提取特定过滤条件的值
      .filter((value, index, self) => self.indexOf(value) === index) // 去重
      .sort(); // 排序
  },

  // 获取过滤后的语音选项
  getFilteredVoiceOptions: () => {
    const { voiceOptions, voiceFilters, formData } = get();
    let filteredVoiceOptions = voiceOptions[formData.tts]; // 获取当前引擎下的所有语音选项
    voiceFilters[formData.tts]?.forEach((element) => {
      filteredVoiceOptions = filteredVoiceOptions.filter(
        (option) => option[element.label] === element.value // 过滤符合条件的语音
      );
    });
    return filteredVoiceOptions.sort((a, b) => a.name.localeCompare(b.name)); // 按名称排序返回
  },

  // 获取当前语音选项
  getCurrentVoiceOption: () => {
    const filteredVoiceOptions = get().getFilteredVoiceOptions(); // 获取过滤后的语音选项
    const currentVoiceOption = filteredVoiceOptions.filter(
      (option) => option.voice_id === get().formData.voice_id // 根据语音 ID 查找当前选项
    )[0];
    return currentVoiceOption ? currentVoiceOption : filteredVoiceOptions[0]; // 如果没找到，返回第一个选项
  },

  // 添加录音文件
  addRecording: (recording) => {
    set({
      voiceFiles: [...
        voiceFiles, recording], // 将新的录音文件添加到 voiceFiles 数组中
      });
    },
  
    // 设置语音错误消息
    setVoiceErrorMsg: (msg) => {
      set({ voiceErrorMsg: msg });
    },
  
    // 检查当前语音是否是克隆语音
    isClonedVoice: (voiceId) => {
      return voiceId && voiceId.startsWith('cloned_'); // 判断语音 ID 是否以 "cloned_" 开头
    },
  
    // 克隆语音功能
    cloneVoice: async () => {
      const formData = await constructForm(get); // 调用 constructForm 构建表单数据
      if (!formData) return;
      
      try {
        const clonedVoiceId = await cloneVoice(get().voiceFiles, get().token); // 调用 API 进行语音克隆
        set({ clonedVoice: clonedVoiceId }); // 设置克隆的语音 ID
        get().setFormData({ voice_id: clonedVoiceId }); // 更新表单中的语音 ID
      } catch (error) {
        console.error('Failed to clone voice:', error);
        get().setVoiceErrorMsg('Failed to clone voice'); // 设置错误消息
      }
    },
  
    // 创建角色功能
    createCharacter: async () => {
      const formData = await constructForm(get); // 调用 constructForm 构建表单数据
      if (!formData) return;
  
      try {
        const character = await createCharacter(formData, get().token); // 调用 API 创建角色
        return character; // 返回创建的角色信息
      } catch (error) {
        console.error('Error creating character:', error);
        get().setErrorMsg('Error creating character'); // 设置错误消息
      }
    },
  
    // 编辑角色功能
    editCharacter: async (characterId) => {
      const formData = await constructForm(get); // 调用 constructForm 构建表单数据
      if (!formData) return;
  
      try {
        const updatedCharacter = await editCharacter(characterId, formData, get().token); // 调用 API 编辑角色
        return updatedCharacter; // 返回更新后的角色信息
      } catch (error) {
        console.error('Error editing character:', error);
        get().setErrorMsg('Error editing character'); // 设置错误消息
      }
    },
  
    // 获取角色功能
    getCharacter: async (characterId) => {
      try {
        const character = await getCharacter(characterId, get().token); // 调用 API 获取角色信息
        set({ formData: { ...get().formData, ...character } }); // 将角色信息合并到表单数据中
        return character; // 返回角色信息
      } catch (error) {
        console.error('Error fetching character:', error);
        get().setErrorMsg('Error fetching character'); // 设置错误消息
      }
    },
  
    // 删除角色功能
    deleteCharacter: async (characterId) => {
      try {
        await deleteCharacter(characterId, get().token); // 调用 API 删除角色
      } catch (error) {
        console.error('Error deleting character:', error);
        get().setErrorMsg('Error deleting character'); // 设置错误消息
      }
    },
  
    // 设置头像文件
    setAvatarFile: (file) => {
      set({ avatarFile: file });
    },
  
    // 设置头像 URL
    setAvatarURL: (url) => {
      set({ avatarURL: url });
    },
  });
  
