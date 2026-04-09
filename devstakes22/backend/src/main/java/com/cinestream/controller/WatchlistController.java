package com.cinestream.controller;

import com.cinestream.model.User;
import com.cinestream.model.WatchlistItem;
import com.cinestream.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WatchlistController {
    private final UserRepository userRepository;

    public WatchlistController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<WatchlistItem>> getWatchlist(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(User::getWatchlist)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/toggle")
    public ResponseEntity<?> toggleWatchlist(@PathVariable Long userId, @RequestBody WatchlistItem item) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        if (user.getWatchlist() == null) user.setWatchlist(new ArrayList<>());

        boolean removed = user.getWatchlist().removeIf(wi -> wi.getTmdbId().equals(item.getTmdbId()));
        if (!removed) {
            user.getWatchlist().add(item);
        }

        userRepository.save(user);
        return ResponseEntity.ok(user.getWatchlist());
    }
}
