import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:virtual_herbal_garden/services/chatbot_service.dart';
import 'package:virtual_herbal_garden/models/plant.dart';
import 'package:virtual_herbal_garden/pages/plant_details_page.dart';

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage> {
  final TextEditingController _messageController = TextEditingController();
  final List<ChatbotMessage> _messages = [];
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  List<Plant> _allPlants = [];

  @override
  void initState() {
    super.initState();
    _messages.add(ChatbotService.getGreeting());
    _loadPlants();
  }

  Future<void> _loadPlants() async {
    try {
      final snapshot =
          await FirebaseFirestore.instance.collection('plants').get();
      setState(() {
        _allPlants = snapshot.docs
            .map((doc) => Plant.fromFirestore(doc.id, doc.data()))
            .toList();
      });
    } catch (e) {
      debugPrint('Error loading plants: $e');
    }
  }

  Future<void> _sendMessage(String userMessage) async {
    if (userMessage.trim().isEmpty) return;

    setState(() {
      _messages.add(ChatbotMessage(
        text: userMessage,
        isUser: true,
        timestamp: DateTime.now(),
      ));
      _isLoading = true;
    });

    _messageController.clear();
    _scrollToBottom();

    // Analyze dietary needs
    final needs = ChatbotService.analyzeDietaryNeeds(userMessage);

    if (needs.isNotEmpty) {
      // Add bot response about found plants
      setState(() {
        _messages.add(ChatbotService.getResponseMessage(userMessage));
      });
      _scrollToBottom();

      // Filter plants and display them
      final recommendedPlants =
          ChatbotService.filterPlantsByNeeds(_allPlants, needs);

      if (recommendedPlants.isNotEmpty) {
        // Add individual plant recommendations
        for (final plant in recommendedPlants) {
          await Future.delayed(const Duration(milliseconds: 600));
          setState(() {
            _messages.add(ChatbotMessage(
              text: ChatbotService.formatPlantRecommendation(plant),
              isUser: false,
              timestamp: DateTime.now(),
              plant: plant,
            ));
          });
          _scrollToBottom();
        }
      }

      // Add follow-up message
      await Future.delayed(const Duration(milliseconds: 600));
      setState(() {
        _messages.add(ChatbotMessage(
          text: ChatbotService.chatbotResponses['more_help']!,
          isUser: false,
          timestamp: DateTime.now(),
        ));
      });
    } else {
      setState(() {
        _messages.add(ChatbotService.getResponseMessage(userMessage));
      });
    }

    setState(() {
      _isLoading = false;
    });

    _scrollToBottom();
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  void _navigateToPlantDetails(Plant plant) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PlantDetailsPage(plant: plant),
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorScheme.primary,
        title: const Text(
          'Herbal Guide Chatbot',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: Column(
        children: [
          Expanded(
            child: _allPlants.isEmpty
                ? Center(
                    child: CircularProgressIndicator(
                      color: colorScheme.primary,
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final message = _messages[index];
                      return _buildMessage(context, message, colorScheme);
                    },
                  ),
          ),
          if (_isLoading)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  CircularProgressIndicator(
                    color: colorScheme.primary,
                    strokeWidth: 2,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Chatbot is thinking...',
                    style: TextStyle(
                      color: colorScheme.primary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colorScheme.surface,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    enabled: !_isLoading,
                    decoration: InputDecoration(
                      hintText: 'Describe your dietary needs...',
                      hintStyle: TextStyle(color: colorScheme.outline),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide(color: colorScheme.outline),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide(
                          color: colorScheme.primary,
                          width: 2,
                        ),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      suffixIcon: _messageController.text.isEmpty
                          ? null
                          : IconButton(
                              icon: Icon(
                                Icons.close,
                                color: colorScheme.outline,
                              ),
                              onPressed: () {
                                _messageController.clear();
                                setState(() {});
                              },
                            ),
                    ),
                    onChanged: (_) => setState(() {}),
                    onSubmitted: (_isLoading) ? null : _sendMessage,
                    maxLines: null,
                    textInputAction: TextInputAction.send,
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: colorScheme.primary,
                  radius: 24,
                  child: IconButton(
                    icon: const Icon(Icons.send),
                    color: Colors.white,
                    onPressed: _isLoading
                        ? null
                        : () => _sendMessage(_messageController.text),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessage(
    BuildContext context,
    ChatbotMessage message,
    ColorScheme colorScheme,
  ) {
    return Column(
      children: [
        Align(
          alignment: message.isUser ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: message.isUser
                  ? colorScheme.primary
                  : colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(16),
            ),
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.8,
            ),
            child: Text(
              message.text,
              style: TextStyle(
                color: message.isUser
                    ? Colors.white
                    : colorScheme.onPrimaryContainer,
                fontSize: 14,
              ),
            ),
          ),
        ),
        if (message.plant != null)
          Align(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: GestureDetector(
                onTap: () => _navigateToPlantDetails(message.plant!),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    border: Border.all(color: colorScheme.primary),
                    borderRadius: BorderRadius.circular(12),
                    color: colorScheme.primaryContainer.withOpacity(0.5),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.info_outline,
                        color: colorScheme.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Tap to view details about ${message.plant!.commonName}',
                          style: TextStyle(
                            color: colorScheme.primary,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      Icon(
                        Icons.arrow_forward,
                        color: colorScheme.primary,
                        size: 16,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
